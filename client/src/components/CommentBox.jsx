import { useState } from "react";
import PropTypes from "prop-types";
import { addComment } from "../services/api";
import { useAuth } from "../context/AuthContext";

function CommentBox({ postId, onCommentAdded }) {
  const { user } = useAuth();

  // ================= STATE =================
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= VALIDATION =================
  const validateInput = () => {
    if (!user) {
      return "Please login to comment";
    }

    if (!content || content.trim() === "") {
      return "Comment cannot be empty";
    }

    if (!postId || isNaN(postId)) {
      return "Invalid Post ID";
    }

    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const validationError = validateInput();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        content: content.trim(),
        postId: Number(postId), // ✅ FIXED
      };

      // 🔍 Debug (optional)
      console.log("Sending Comment Payload:", payload);

      await addComment(payload);

      // ✅ Reset input
      setContent("");

      // 🔄 Refresh comments
      if (onCommentAdded) {
        onCommentAdded();
      }

    } catch (err) {
      console.error("Comment Error:", err);

      let message = "Failed to add comment";

      if (typeof err === "string") {
        message = err;
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div
      className="flex flex-col gap-2"
      style={{ marginTop: "10px", maxWidth: "500px" }}
    >
      {/* INPUT */}
      <input
        type="text"
        placeholder="💬 Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      {/* BUTTON */}
      <button
        className="primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "8px",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Posting..." : "Add Comment"}
      </button>

      {/* ERROR MESSAGE */}
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "14px",
            marginTop: "5px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ================= PROPS =================
CommentBox.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onCommentAdded: PropTypes.func,
};

export default CommentBox;