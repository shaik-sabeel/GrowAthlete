// src/pages/SportsBlogPage.jsx
import React, { useState, useEffect } from 'react';
import BlogPostCard from '../components/BlogPostCard';
import mockBlogPosts from '../data/mockBlogPosts';
import './SportsBlogPage.css';
// import BlogVideoBg from '../assets/images/background.mp4'; // <--- IMPORT YOUR VIDEO

const SportsBlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlogPosts(mockBlogPosts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="loading-message">Loading blog posts...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (blogPosts.length === 0) return <div className="no-posts-message">No blog posts found.</div>;

  return (
    <div className="sports-blog-page">
      <div className="blog-hero">
        {/* ADD VIDEO BACKGROUND HERE */}
        <video autoPlay loop muted playsInline className="blog-hero-video">
          <source src={BlogVideoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="blog-hero-overlay"></div> {/* Optional: For darker overlay */}
        <div className="blog-hero-content"> {/* Wrap existing text in content div */}
          <h1 className="blog-hero-title">Latest <span className="highlight">Sports News</span> & Insights</h1>
          <p className="blog-hero-subtitle">Stay updated with exclusive articles, analysis, and stories from the world of Indian sports.</p>
        </div>
      </div>

      <section className="blog-posts-grid-section">
        <div className="blog-posts-grid">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SportsBlogPage;