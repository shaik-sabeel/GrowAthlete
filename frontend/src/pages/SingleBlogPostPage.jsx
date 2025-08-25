// src/pages/SingleBlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import mockBlogPosts from '../data/mockBlogPosts'; // Path to your mock data
import '../pages_css/SingleBlogPostPage.css'; // New CSS file for the single post page
import {Link} from 'react-router-dom';

const SingleBlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetch(`http://localhost:5000/api/blog/${slug}`)
    .then(res => res.json())
    .then(data => {
      setPost(data);
      setLoading(false);
    })
    .catch(err => {
      setError("Failed to load blog post");
      setLoading(false);
    });
}, [slug]);


  if (loading) return <div className="loading-message">Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="error-message">Post data is missing.</div>; // Should ideally not happen with previous checks

  return (
    <>
      <Navbar />
    <div className="single-blog-post-page">
      {/* <div className="post-header-image">
        <img src={post.image} alt={post.title} />
      </div> */}
      <div className="post-content-container">
        <Link to='/sports-blog' className="back-button">&larr; Back to Blog</Link>
        <span className="post-category">{post.category}</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
  <span>By {post.author?.name || "Unknown"}</span>
  <span>&bull;</span>
  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
</div>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
    </div>
    </>
  );
};

export default SingleBlogPostPage;