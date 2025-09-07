// src/components/CommunityFeed.jsx

import React, { useState, useEffect } from 'react';
import Post from './Post';
import api from '../utils/api';

const CommunityFeed = ({ currentUserId }) => {
  // If no user ID, show login prompt
  if (!currentUserId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Please log in to view and interact with community posts.</p>
        <a 
          href="/login" 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Login
        </a>
      </div>
    );
  }
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (page = 1, sort = sortBy, append = false) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.get('/community/public', {
        params: {
          page,
          limit: 10,
          sort
        }
      });

      console.log('API Response:', response.data); // Debug log

      const { posts: newPosts, totalPages: total, currentPage: pageNum } = response.data;
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setCurrentPage(pageNum);
      setTotalPages(total);
      setHasMore(pageNum < total);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, sortBy, false);
  }, [sortBy]);

  const handlePostCreated = (newPost) => {
    // Add new post to the beginning of the list
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    // Update the specific post in the list
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDeleted = (deletedPostId) => {
    // Remove the deleted post from the list
    setPosts(prev => prev.filter(post => post._id !== deletedPostId));
  };

  const loadMorePosts = () => {
    if (hasMore && !isLoading) {
      fetchPosts(currentPage + 1, sortBy, true);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    setHasMore(true);
  };

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchPosts(1, sortBy, false)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="community-feed">
      {/* Sort Controls */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Community Feed</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostLiked">Most Liked</option>
            <option value="mostCommented">Most Commented</option>
          </select>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 && !isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Post
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && posts.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={loadMorePosts}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-200 text-white-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && posts.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading posts...</p>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
