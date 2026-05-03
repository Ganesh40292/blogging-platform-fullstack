import { useState } from "react";
import PropTypes from "prop-types";
import { deleteComment, updateComment } from "../services/api";

function CommentList({ comments, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  if (!comments || comments.length === 0) {
    return <p style={{ color: "#ccc" }}>No comments yet</p>;
  }

  const handleDelete = async (id) => {
    if (!globalThis.confirm("Delete this comment?")) return;

    await deleteComment(id);
    refresh();
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditText(c.content);
  };

  const saveEdit = async (id) => {
    await updateComment(id, { content: editText });
    setEditingId(null);
    refresh();
  };

  return (
    <div>
      {comments.map((c) => (
        <div key={c.id} className="card">

          {editingId === c.id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

              <button className="primary" onClick={() => saveEdit(c.id)}>
                Save
              </button>

              <button onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="post-content">{c.content}</p>

              <small className="post-author">
                — {c.user?.name || "User"}
              </small>

              <br /><br />

              <button onClick={() => startEdit(c)}>Edit</button>

              <button
                className="danger"
                onClick={() => handleDelete(c.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default CommentList;