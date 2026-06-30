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
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    try {
      setLoading(true);
      await createPost({ title, content, category, tags, imageUrl });
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(30, 30, 40, 0.95)',
                  color: '#fff',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
                <option value="Business">Business</option>
                <option value="Food">Food</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div className="input-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. java, react, coding"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Featured Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-upload-input"
            />
            <div 
              style={{
                border: '2px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.03)',
                transition: 'border-color 0.2s'
              }}
              onClick={() => document.getElementById('image-upload-input').click()}
            >
              {imageUrl ? (
                <div>
                  <img src={imageUrl} alt="Preview" style={{ maxHeight: '150px', borderRadius: '4px', marginBottom: '10px', objectFit: 'cover' }} />
                  <p style={{ fontSize: '0.9rem', color: '#a29bfe', margin: 0 }}>Click to change image</p>
                </div>
              ) : (
                <p style={{ color: '#ccc', margin: 0 }}>Upload or Drag a cover image here (Max 5MB)</p>
              )}
            </div>
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