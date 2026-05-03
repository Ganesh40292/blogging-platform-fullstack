import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { truncateText, calculateReadingTime } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import { deletePost } from "../services/api";
import { FaShareAlt, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

function PostCard({ post, refresh }) {
  const { user } = useAuth();
  if (!post) return null;

  const isOwner = user?.id === post.user?.id;

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
      <div className="card-top">
        <h3>
          <Link to={`/post/${post.id}`} className="post-link">
            {post.title || "Untitled"}
          </Link>
        </h3>
        <span className="reading-time">{calculateReadingTime(post.content)}</span>
      </div>

      {/* 🔥 Render HTML Content from Quill */}
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: truncateText(post.content || "", 120) }}
      />

      <div className="card-footer">
        <small className="post-author">
          By: {post.user?.name || "Unknown"}
        </small>

        <div className="card-actions">
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