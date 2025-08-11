// src/components/BlogPostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPostCard.css'; // New CSS file for the card
import Button from './Button'; // Assuming you have this Button component

const BlogPostCard = ({ post }) => {
  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="blog-card-content">
        <span className="blog-card-category">{post.category}</span>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-meta">
          <span>{post.author}</span>
          <span>&bull;</span>
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <Link to={`/sports-blog/${post.slug}`} className="blog-card-link">
          {/* Using your custom Button component for consistent styling */}
          <Button variant="blog-readmore">Read More &rarr;</Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;