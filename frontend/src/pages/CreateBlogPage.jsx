import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages_css/BlogPage.css";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    const newBlog = {
      id: Date.now(), // unique ID
      title,
      content,
      author: "Athlete", // you can later replace with logged-in user
    };

    const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    savedBlogs.unshift(newBlog);
    localStorage.setItem("blogs", JSON.stringify(savedBlogs));

    navigate("/blogs");
  };

  return (
    <div className="blog-form-container">
      <h1>Create a Blog</h1>
      <button className="back-btn" onClick={() => navigate("/blogs")}>
        ← Back to Blogs
      </button>
      <form onSubmit={handleSubmit} className="blog-form">
        <input
          type="text"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your blog here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          required
        />

        <button type="submit" className="submit-btn">
          Post Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
