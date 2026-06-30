import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getPostById,
  getCommentsByPost,
  deletePost,
  toggleLikePost,
  toggleFollowUser,
  getUserFollowStats,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { calculateReadingTime } from "../utils/helpers";
import { FaShareAlt, FaTrash, FaChevronRight, FaClock, FaHeart, FaRegHeart, FaUserPlus, FaUserCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import CommentBox from "../components/CommentBox";
import CommentList from "../components/CommentList";

function PostDetails() {
  const { user: loggedInUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followStats, setFollowStats] = useState({ followersCount: 0, followingCount: 0, isFollowing: false });

  const fetchFollowStats = async (authorId) => {
    if (!authorId) return;
    try {
      const statsRes = await getUserFollowStats(authorId);
      setFollowStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching follow stats:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [postRes, commentRes] = await Promise.all([
        getPostById(id),
        getCommentsByPost(id),
      ]);

      setPost(postRes.data);
      setComments(commentRes.data);
      setError("");

      if (postRes.data && postRes.data.user) {
        await fetchFollowStats(postRes.data.user.id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const isOwner = loggedInUser?.id === post?.user?.id;
  const hasLiked = post?.likes?.some(like => like.user?.id === loggedInUser?.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied! 🔗");
  };

  const handleDelete = async () => {
    if (!globalThis.confirm("Delete this post?")) return;

    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error deleting post");
    }
  };

  const handleLike = async () => {
    if (!loggedInUser) {
      toast.error("Please login to like posts");
      return;
    }
    try {
      await toggleLikePost(post.id);
      // Retrieve fresh data for updated likes
      const postRes = await getPostById(id);
      setPost(postRes.data);
    } catch (err) {
      toast.error("Error liking post");
    }
  };

  const handleFollow = async () => {
    if (!loggedInUser) {
      toast.error("Please login to follow authors");
      return;
    }
    try {
      const res = await toggleFollowUser(post.user.id);
      setFollowStats(res.data);
      toast.success(res.data.isFollowing ? "Following author! 👤" : "Unfollowed author");
    } catch (err) {
      toast.error("Error updating follow state");
    }
  };

  if (loading) return <div className="skeleton"></div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container">
      {/* 🛣️ Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link to="/">Home</Link>
        <FaChevronRight size={10} />
        <span>Post</span>
        <FaChevronRight size={10} />
        <span className="current">{post.title}</span>
      </nav>

      {/* Featured Cover Image */}
      {post.imageUrl && (
        <div style={{ width: '100%', maxHeight: '350px', overflow: 'hidden', borderRadius: '12px', marginBottom: '20px' }}>
          <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* POST */}
      <div className="card">
        {/* Category & Tags Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
          {post.category && (
            <span style={{ fontSize: '0.8rem', background: '#a29bfe', color: '#13131a', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
              {post.category}
            </span>
          )}
          {post.tags && post.tags.split(',').map(tag => tag.trim() && (
            <span key={tag} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', color: '#ccc', padding: '4px 12px', borderRadius: '12px' }}>
              #{tag.trim()}
            </span>
          ))}
        </div>

        <div className="post-header-top">
          <h1>{post.title}</h1>
          <div className="post-meta" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className="read-tag"><FaClock /> {calculateReadingTime(post.content)}</span>
            
            <button 
              onClick={handleLike}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: hasLiked ? '#ff7675' : '#ccc',
                padding: '5px'
              }}
              title={hasLiked ? "Unlike" : "Like"}
            >
              {hasLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              <span style={{ color: '#fff' }}>{post.likes?.length || 0}</span>
            </button>

            <button className="icon-btn share" onClick={handleShare} title="Copy Link">
              <FaShareAlt size={18} />
            </button>
          </div>
        </div>

        {/* 🔥 Full HTML Content Render */}
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="post-footer-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <small className="post-author" style={{ margin: 0 }}>
              Written by <strong>{post.user?.name || "Unknown"}</strong>
            </small>
            
            {loggedInUser && !isOwner && (
              <button 
                onClick={handleFollow}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: followStats.isFollowing ? 'rgba(162, 155, 254, 0.2)' : 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                {followStats.isFollowing ? (
                  <>
                    <FaUserCheck /> Following ({followStats.followersCount})
                  </>
                ) : (
                  <>
                    <FaUserPlus /> Follow ({followStats.followersCount})
                  </>
                )}
              </button>
            )}
            
            {!loggedInUser && (
              <span style={{ fontSize: '0.8rem', color: '#888' }}>
                ({followStats.followersCount} followers)
              </span>
            )}
          </div>

          {isOwner && (
            <button className="danger delete-btn" onClick={handleDelete}>
              <FaTrash /> Delete Post
            </button>
          )}
        </div>
      </div>

      {/* COMMENTS */}
      <div className="card">
        <h2>Comments</h2>

        <CommentList comments={comments} refresh={fetchData} />

        <hr />

        <CommentBox postId={post.id} onCommentAdded={fetchData} />
      </div>
    </div>
  );
}

export default PostDetails;