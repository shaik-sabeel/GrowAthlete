// src/pages/SingleBlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../pages_css/SingleBlogPostPage.css'; // Your updated CSS file
import { Link } from 'react-router-dom';

const SingleBlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch single blog post from your backend API
    fetch(`http://localhost:5000/api/blog/${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load blog post:", err);
        setError("Blog post not found or failed to load.");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="loading-message">Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="error-message">Post data is missing.</div>;

  return (
    <>
      <Navbar />
      <div className="single-blog-post-page">
        {post.image && ( // Conditionally render image if available
          <div className="post-header-image">
            <img src={post.image} alt={post.title} />
          </div>
        )}

        <div className="post-content-wrapper"> {/* New wrapper div */}
            <div className="back-to-blog-container"> {/* Container for back link and category */}
                <Link to='/sports-blog' className="back-to-blog-link">
                    <span className="back-arrow">&larr;</span> Back to Blog
                </Link>
                {post.category && <span className="post-category">{post.category}</span>}
            </div>
            
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
                <span>By {post.author?.name || "Unknown"}</span>
                <span>&bull;</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                {post.readTime && ( // Display read time if available
                    <>
                        <span>&bull;</span>
                        <span>{post.readTime} min read</span>
                    </>
                )}
            </div>
            <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
      </div>
    </>
  );
};

export default SingleBlogPostPage;