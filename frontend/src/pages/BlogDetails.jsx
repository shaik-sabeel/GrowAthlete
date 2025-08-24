import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../pages_css/BlogPage.css";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const foundBlog = savedBlogs.find((b) => String(b.id) === String(id));
    setBlog(foundBlog || null);
  }, [id]);

  const handleDelete = () => {
    if (!blog) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const updatedBlogs = savedBlogs.filter((b) => String(b.id) !== String(id));
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    navigate("/blogs");
  };

  if (!blog) return <p>Blog not found!</p>;

  return (
    <div className="blog-details-container">
      <h1>Title: {blog.title}</h1><hr /><br />
      <p className="blog-author">By {blog.author}</p><hr /><br />
      <p className="blog-content"> <b>Content: </b> <br />{blog.content}</p><br />
<button className="back-btn" onClick={() => navigate("/blogs")}>
        ← Back to Blogs
      </button>
      {blog.author === "Athlete" && (
        
        <button className="delete-details-btn" onClick={handleDelete}>
          Delete
        </button>
      )}

      
    </div>
  );
};

export default BlogDetails;
