// src/components/Post.jsx

import React, { useState, useEffect } from 'react';
import { FaFlag, FaEllipsisH, FaHeart, FaRegHeart, FaComment, FaTrash, FaEdit } from 'react-icons/fa';
import ContentFlagModal from './ContentFlagModal';
import api from '../utils/api';

const Post = ({ post, onPostUpdated, onPostDeleted, currentUserId }) => {
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = currentUserId === post.author._id;
  const isLiked = post.likes.some(like => like._id === currentUserId);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await api.delete(`/community/${post._id}/like`);
      } else {
        await api.post(`/community/${post._id}/like`);
      }
      
      // Update the post locally for immediate UI feedback
      const updatedPost = {
        ...post,
        likes: isLiked 
          ? post.likes.filter(like => like._id !== currentUserId)
          : [...post.likes, { _id: currentUserId }]
      };
      
      if (onPostUpdated) {
        onPostUpdated(updatedPost);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await api.post(`/community/${post._id}/comments`, {
        content: commentContent.trim()
      });

      // Update the post locally for immediate UI feedback
      const updatedPost = {
        ...post,
        comments: [...post.comments, response.data.comment]
      };
      
      if (onPostUpdated) {
        onPostUpdated(updatedPost);
      }

      setCommentContent('');
      setShowCommentInput(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditPost = async () => {
    if (!editContent.trim() || isEditing) return;

    setIsEditing(true);
    try {
      const response = await api.patch(`/community/${post._id}`, {
        content: editContent.trim()
      });

      if (onPostUpdated) {
        onPostUpdated(response.data);
      }

      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/community/${post._id}`);
        
        if (onPostDeleted) {
          onPostDeleted(post._id);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postDate.toLocaleDateString();
  };

  const renderMedia = (media) => {
    if (!media || media.length === 0) return null;

    // Use the same base URL as the API to access uploaded media files
    const baseURL = 'http://localhost:5000';

    return (
      <div className="mt-3 pl-12">
        <div className="grid grid-cols-1 gap-2">
          {media.map((item, index) => (
            <div key={index}>
              {item.mediaType === 'image' ? (
                <img
                  src={`${baseURL}${item.url}`}
                  alt="Post media"
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error('Failed to load image:', `${baseURL}${item.url}`);
                    e.target.style.display = 'none';
                  }}
                />
              ) : item.mediaType === 'video' ? (
                <video
                  src={`${baseURL}${item.url}`}
                  controls
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error('Failed to load video:', `${baseURL}${item.url}`);
                  }}
                />
              ) : (
                <a
                  href={`${baseURL}${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <span>📄</span>
                  <span>Document</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;

    return (
      <div className="mt-2 pl-12">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-blue-600 text-sm">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="post">
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        {/* User Info Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* User Picture */}
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <img
              src={post.author.profilePicture || '/default-avatar.png'}
                             alt={post.author.username}
              className="w-full h-full object-cover"
            />
          </div>
          {/* User Name and Time */}
          <div className="ml-3">
            <p className="font-semibold text-gray-100 px-2">{post.author.username}</p>
            <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        
        {/* Post Actions Menu */}
        <div className="relative flex items-center space-x-2">
          {isAuthor && (
            <>
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                title="Edit post"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDeletePost}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Delete post"
              >
                <FaTrash />
              </button>
            </>
          )}
          <button
            onClick={() => setShowFlagModal(true)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
            title="Flag post"
          >
            <FaFlag />
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <div className="mb-4 pl-12">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows="3"
            maxLength="2000"
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleEditPost}
              disabled={isEditing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isEditing ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowEditForm(false);
                setEditContent(post.content);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Post Content */}
      {!showEditForm && (
        <p className="text-white-700 mb-4 pl-12">{post.content}</p>
      )}

      {/* Media */}
      {renderMedia(post.media)}

      {/* Tags */}
      {renderTags(post.tags)}

      {/* Like and Comment Buttons */}
      <div className="flex items-center space-x-6 text-gray-600 border-b border-gray-200 pb-3 mb-4 pl-12">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-1 transition duration-150 ease-in-out ${
            isLiked ? 'text-red-500' : 'hover:text-red-500'
          }`}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>Like ({post.likes.length})</span>
        </button>
        <button 
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="flex items-center space-x-1 action-btn-comment transition duration-150 ease-in-out hover:text-blue-500"
        >
          <FaComment />
          <span>Comment ({post.comments.length})</span>
        </button>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="mb-4 pl-12">
          <form onSubmit={handleComment} className="flex space-x-2">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              maxLength="500"
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !commentContent.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmittingComment ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      )}

      {/* Comments Section */}
      {post.comments.length > 0 && (
        <div className="pl-12">
          {post.comments.map((comment) => (
            <div key={comment._id} className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-gray-800 text-sm">
                  {comment.author.username}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              <span className="text-gray-700 text-sm">{comment.content}</span>
            </div>
          ))}
        </div>
      )}
      
             {/* Content Flag Modal */}
       <ContentFlagModal
         isOpen={showFlagModal}
         onClose={() => setShowFlagModal(false)}
         contentType="community"
         contentId={post._id}
         contentPreview={post.content}
       />
       </div>
     </div>
   );
 };

export default Post;