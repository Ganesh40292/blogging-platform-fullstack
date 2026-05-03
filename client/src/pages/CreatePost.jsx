import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    try {
      setLoading(true);
      await createPost({ title, content });
      toast.success("Post created successfully! 🚀");
      navigate("/");
    } catch (err) {
      toast.error("Failed to create post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
    >
      <div className="card">
        <h1 className="page-title">Create New Post</h1>
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="input-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Content</label>
            <div className="quill-wrapper">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={quillModules}
                placeholder="Write your amazing story here..."
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '20px', padding: '15px', fontSize: '1.1rem' }}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default CreatePost;