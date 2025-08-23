import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages_css/BlogPage.css";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    setBlogs(savedBlogs);
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    const updatedBlogs = blogs.filter((b) => b.id !== id);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
  };

  return (
    <div className="blogs-container">
      <div className="blogs-header">
        <h1>All Blogs</h1>
        <button className="create-btn" onClick={() => navigate("/create-blog")}>
          + Create Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <p>No blogs available. Create one!</p>
      ) : (
        <div className="blogs-list">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <h2><b>Title: {blog.title}</b></h2>
              <p>
                {blog.content.split(" ").slice(0, 25).join(" ")}
                {blog.content.split(" ").length > 25 ? "..." : ""}
              </p>
              <div className="blog-actions">
                <Link to={`/blogs/${blog.id}`} className="read-more-btn">
                  Read More
                </Link>
                {blog.author === "Athlete" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
