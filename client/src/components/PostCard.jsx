import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { truncateText, calculateReadingTime } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import { deletePost, toggleLikePost } from "../services/api";
import { FaShareAlt, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

function PostCard({ post, refresh }) {
  const { user } = useAuth();
  if (!post) return null;

  const isOwner = user?.id === post.user?.id;
  const hasLiked = post.likes?.some(like => like.user?.id === user?.id);

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard! 🔗");
  };

  const handleDelete = async () => {
    if (!globalThis.confirm("Delete this post?")) return;

    try {
      await deletePost(post.id);
      if (refresh) refresh();
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Error deleting post");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }
    try {
      await toggleLikePost(post.id);
      if (refresh) refresh();
    } catch (error) {
      toast.error("Error liking post");
    }
  };

  return (
    <motion.div
      className="card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {post.imageUrl && (
        <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px', marginBottom: '15px' }}>
          <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div className="card-top">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '80%' }}>
          {/* Category & Tags Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {post.category && (
              <span style={{ fontSize: '0.75rem', background: '#a29bfe', color: '#13131a', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                {post.category}
              </span>
            )}
            {post.tags && post.tags.split(',').map(tag => tag.trim() && (
              <span key={tag} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', color: '#ccc', padding: '2px 8px', borderRadius: '12px' }}>
                #{tag.trim()}
              </span>
            ))}
          </div>

          <h3>
            <Link to={`/post/${post.id}`} className="post-link">
              {post.title || "Untitled"}
            </Link>
          </h3>
        </div>
        <span className="reading-time">{calculateReadingTime(post.content)}</span>
      </div>

      {/* 🔥 Render HTML Content from Quill */}
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ 
          __html: truncateText(post.content || "", 120).replace(/&nbsp;|\u00a0/g, " ") 
        }}
      />

      <div className="card-footer">
        <small className="post-author">
          By: {post.user?.name || "Unknown"}
        </small>

        <div className="card-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            className="icon-btn like" 
            onClick={handleLike} 
            title={hasLiked ? "Unlike" : "Like"}
            style={{ color: hasLiked ? '#ff7675' : '#ccc', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {hasLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
            <span style={{ fontSize: '0.9rem', color: '#fff' }}>{post.likes?.length || 0}</span>
          </button>

          <button className="icon-btn share" onClick={handleShare} title="Copy Link">
            <FaShareAlt size={18} />
          </button>
          
          {isOwner && (
            <button className="icon-btn delete" onClick={handleDelete} title="Delete">
              <FaTrash size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  refresh: PropTypes.func,
};

export default PostCard;