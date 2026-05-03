import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getPostById,
  getCommentsByPost,
  deletePost,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { calculateReadingTime } from "../utils/helpers";
import { FaShareAlt, FaTrash, FaChevronRight, FaClock } from "react-icons/fa";
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

      {/* POST */}
      <div className="card">
        <div className="post-header-top">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="read-tag"><FaClock /> {calculateReadingTime(post.content)}</span>
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

        <div className="post-footer-details">
          <small className="post-author">
            Written by <strong>{post.user?.name || "Unknown"}</strong>
          </small>

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