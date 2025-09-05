// src/pages/SportsBlogPage.jsx
import React, { useState, useEffect } from 'react';
import BlogPostCard from '../components/BlogPostCard';
import Navbar from '../components/Navbar';
// No longer importing mockBlogPosts as we're fetching from API
import '../pages_css/SportsBlogPage.css';
import BlogVideoBg from '../assets/growathlete_bg.mp4'; // Make sure this path is correct if you use it
import { Link } from 'react-router-dom';

const SportsBlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch blog posts from your backend API
    fetch("http://localhost:5000/api/blog")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBlogPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load blog posts:", err);
        setError("Failed to load blog posts. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-message">Loading blog posts...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (blogPosts.length === 0) return <div className="no-posts-message">No blog posts found.</div>;

  return (
    <>
      <Navbar />
      <div className="sports-blog-page">
        <div className="blog-hero">
          {/* Use the video background if you want */}
          {/* {BlogVideoBg && (
            <video autoPlay loop muted playsInline className="blog-hero-video">
              <source src={BlogVideoBg} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )} */}
          <div className="blog-hero-overlay"></div> {/* Optional: For darker overlay */}
          <div className="blog-hero-content">
            <h1 className="blog-hero-title">Latest <span className="highlight">Sports News</span> & Insights</h1>
            <p className="blog-hero-subtitle">Stay updated with exclusive articles, analysis, and stories from the world of Indian sports.</p>
            <Link to="/Create-blog" className="blog-hero-link"><button className="blog-hero-link">Create blog</button></Link> 
          </div>
        </div>

        <section className="blog-posts-grid-section">
          <div className="blog-posts-grid">
            {blogPosts.map((post) => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default SportsBlogPage;

