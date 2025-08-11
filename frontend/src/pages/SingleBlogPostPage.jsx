// src/pages/SingleBlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockBlogPosts from '../data/mockBlogPosts'; // Path to your mock data
import './SingleBlogPostPage.css'; // New CSS file for the single post page

const SingleBlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch by slug from your backend:
    // try {
    //   const response = await api.get(`/blog/posts/${slug}`);
    //   setPost(response.data);
    // } catch (err) {
    //   if (err.response && err.response.status === 404) {
    //     setError('Blog post not found.');
    //   } else {
    //     setError('Failed to load blog post.');
    //   }
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }

    // For mock data: find the post by slug
    const foundPost = mockBlogPosts.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
      setLoading(false);
    } else {
      setError('Blog post not found.');
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div className="loading-message">Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="error-message">Post data is missing.</div>; // Should ideally not happen with previous checks

  return (
    <div className="single-blog-post-page">
      <div className="post-header-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content-container">
        <button onClick={() => navigate(-1)} className="back-button">&larr; Back to Blog</button>
        <span className="post-category">{post.category}</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>By {post.author}</span>
          <span>&bull;</span>
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
    </div>
  );
};

export default SingleBlogPostPage;