// src/components/BlogPostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPostCard.css'; // New CSS file for the card
import Button from './Button'; // Assuming you have this Button component

const BlogPostCard = ({ post }) => {
  // Default values for author to prevent errors if not populated
  const authorName = post.author?.name || "Anonymous";
  const authorProfilePicture = post.author?.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"; // A generic default avatar

  const date = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="blog-card-content">
        <span className="blog-card-category">{post.category}</span>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.summary}</p>
        <div className="blog-card-author-info">
          <img src={authorProfilePicture} alt={authorName} className="blog-card-author-avatar" />
          <div className="blog-card-author-text">
            <span className="blog-card-author-name">{authorName}</span>
            <span className="blog-card-meta-date-read">{date} &bull; {post.readTime || 5} min read</span>
          </div>
        </div>
        <Link to={`/sports-blog/${post.slug}`} className="blog-card-link">
          <Button className="blog-readmore">Read More &rarr;</Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;