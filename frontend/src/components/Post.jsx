// src/components/Post.jsx

import React, { useState, useEffect } from 'react';
import { FaFlag, FaEllipsisH, FaHeart, FaRegHeart, FaComment, FaTrash, FaEdit } from 'react-icons/fa';
import ContentFlagModal from './ContentFlagModal';
import api from '../utils/api';

const Post = ({ post, onPostUpdated, onPostDeleted, currentUserId }) => {
  // Add null check for post
  if (!post) {
    return <div className="p-4 text-center text-gray-500">Post data is missing</div>;
  }
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [isFlaggedLocal, setIsFlaggedLocal] = useState(post.isFlagged || post.status === 'flagged');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyOpenMap, setReplyOpenMap] = useState({});
  const [replyContentMap, setReplyContentMap] = useState({});
  const REACTIONS = ['👍','❤️','😂','👏','🙌'];
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const [reactionCounts, setReactionCounts] = useState(() => {
    const counts = {};
    (post.reactions || []).forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  });
  const [myReaction, setMyReaction] = useState(() => {
    if (!post.reactions) return null;
    const r = post.reactions?.find(r => r.userId === currentUserId);
    return r ? r.type : null;
  });

  const isAuthor = post.author && currentUserId === post.author._id;
  const isLiked = post.likes && post.likes.some(like => like._id === currentUserId);

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
          ? (post.likes || []).filter(like => like._id !== currentUserId)
          : [...(post.likes || []), { _id: currentUserId }]
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

  const handleReact = async (type) => {
    // Optimistic toggle between reactions
    setReactionCounts(prev => {
      const next = { ...prev };
      if (myReaction && next[myReaction]) next[myReaction] -= 1;
      next[type] = (next[type] || 0) + (myReaction === type ? 0 : 1);
      return next;
    });
    const previous = myReaction;
    setMyReaction(prev => (prev === type ? prev : type));
    try {
      await api.post(`/community/${post._id}/react`, { type });
    } catch (e) {
      // revert on error
      setMyReaction(previous);
      setReactionCounts(prev => {
        const next = { ...prev };
        if (prev[type]) next[type] -= 1;
        if (previous) next[previous] = (next[previous] || 0) + 1;
        return next;
      });
      console.error('Error sending reaction:', e);
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
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://growathlete-1.onrender.com';

    const isCarousel = media.length > 1;

    return (
      <div className="mt-3 pl-12">
        <div
          className={
            isCarousel
              ? 'flex overflow-x-auto space-x-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300'
              : 'grid grid-cols-1 gap-2'
          }
        >
          {media.map((item, index) => (
            <div
              key={index}
              className={isCarousel ? 'flex-shrink-0 snap-center w-64 sm:w-80' : ''}
            >
              {item.mediaType === 'image' ? (
                <img
                  src={`${baseURL}${item.url}`}
                  alt="Post media"
                  className={`rounded-lg ${isCarousel ? 'w-full h-40 sm:h-52 object-cover' : 'max-w-full h-auto'}`}
                  onError={(e) => {
                    console.error('Failed to load image:', `${baseURL}${item.url}`);
                    e.target.style.display = 'none';
                  }}
                />
              ) : item.mediaType === 'video' ? (
                <video
                  src={`${baseURL}${item.url}`}
                  controls
                  className={`rounded-lg ${isCarousel ? 'w-full h-40 sm:h-52 object-cover' : 'max-w-full h-auto'}`}
                  onError={(e) => {
                    console.error('Failed to load video:', `${baseURL}${item.url}`);
                  }}
                />
              ) : (
                <a
                  href={`${baseURL}${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 ${isCarousel ? 'w-64 sm:w-80' : ''}`}
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
        {isFlaggedLocal && (
          <div className="mb-3 pl-12 pr-4">
            <div className="flex items-center justify-between p-2 rounded bg-yellow-50 border border-yellow-200">
              <span className="text-xs text-yellow-800">Flagged — pending review</span>
              <span className="text-[11px] text-yellow-700">Visible only until admin action</span>
            </div>
          </div>
        )}
        {/* User Info Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* User Picture */}
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <img
              src={post.author?.profilePicture || '/default-avatar.png'}
              alt={post.author?.username || 'Unknown User'}
              className="w-full h-full object-cover"
            />
          </div>
          {/* User Name and Time */}
          <div className="ml-3">
            <p className="font-semibold text-gray-100 px-2">{post.author?.username || 'Unknown User'}</p>
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
                setEditContent(post.content || '');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Post Content with Read more toggle */}
      {!showEditForm && (
        <p className="text-white-700 mb-4 pl-12">{post.content || 'No content available'}</p>
      )}

      {/* Media */}
      {renderMedia(post.media)}

      {/* Tags */}
      {renderTags(post.tags)}

      {/* Reactions and Comment Button (compact) */}
      <div className="flex items-center justify-between text-gray-600 pb-2 mb-3 pl-12 pr-4">
        <div className="flex items-center space-x-1">
          {REACTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleReact(r)}
              className={`px-1.5 py-0.5 rounded hover:bg-gray-100 ${myReaction === r ? 'bg-gray-100' : ''}`}
              style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
              title="React"
            >
              <span className="text-[18px] leading-none">{r}</span>
              <span className="ml-1 text-[11px] text-gray-500 align-middle">{reactionCounts[r] || 0}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="inline-flex items-center gap-1 text-gray-600 hover:text-blue-500"
          style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}
          title="Comment"
          aria-label="Comment"
        >
          <FaComment className="text-[16px] text-gray-500" />
          <span className="text-[12px] text-gray-500">{post.comments?.length || 0}</span>
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
              className="px-4 py-2 bg-[var(--ga-orange)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isSubmittingComment ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      )}

      {/* Comments Section */}
      {post.comments && post.comments.length > 0 && (
        <div className="pl-12">
          {(() => {
            const sorted = [...post.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const visible = showAllComments ? sorted : sorted.slice(0, 2);
            return (
              <>
                {visible.map((comment) => (
                  <div key={comment._id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800 text-sm">
                        {comment.author?.username || comment.author?.name || 'User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm whitespace-pre-wrap mb-2">{comment.content}</div>
                    {/* Replies */}
                    {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                      <div className="ml-4 space-y-2">
                        {comment.replies.map((rep) => (
                          <div key={rep._id} className="p-2 bg-white rounded border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-700 text-xs">{rep.author?.username || rep.author?.name || 'User'}</span>
                              <span className="text-[11px] text-gray-400">{formatTimeAgo(rep.createdAt)}</span>
                            </div>
                            <div className="text-gray-700 text-sm whitespace-pre-wrap">{rep.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Quick reply */}
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setReplyOpenMap(m => ({ ...m, [comment._id]: !m[comment._id] }))}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {replyOpenMap[comment._id] ? 'Cancel reply' : 'Reply'}
                      </button>
                    </div>
                    {replyOpenMap[comment._id] && (
                      <form
                        className="mt-2 flex items-center space-x-2"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const content = (replyContentMap[comment._id] || '').trim();
                          if (!content) return;
                          try {
                            const resp = await api.post(`/community/${post._id}/comments/${comment._id}/replies`, { content });
                            const newReply = resp.data?.reply || { _id: Math.random().toString(36).slice(2), content, author: { _id: currentUserId }, createdAt: new Date().toISOString() };
                            const updatedPost = {
                              ...post,
                              comments: (post.comments || []).map(c => c._id === comment._id ? { ...c, replies: [...(c.replies || []), newReply] } : c)
                            };
                            if (onPostUpdated) onPostUpdated(updatedPost);
                            setReplyContentMap(m => ({ ...m, [comment._id]: '' }));
                            setReplyOpenMap(m => ({ ...m, [comment._id]: false }));
                          } catch (err) {
                            console.error('Error posting reply:', err);
                          }
                        }}
                      >
                        <input
                          type="text"
                          value={replyContentMap[comment._id] || ''}
                          onChange={(e) => setReplyContentMap(m => ({ ...m, [comment._id]: e.target.value }))}
                          placeholder="Write a reply..."
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          maxLength="500"
                        />
                        <button type="submit" className="px-3 py-2 bg-[var(--ga-orange)] text-white rounded hover:opacity-90 text-sm">Reply</button>
                      </form>
                    )}
                  </div>
                ))}
                {post.comments && post.comments.length > 2 && (
                  <div className="mt-1 flex justify-end">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => setShowAllComments((s) => !s)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowAllComments((s) => !s); } }}
                      className="text-[13px] text-gray-500 pt-1 cursor-pointer select-none hover:text-gray-700 hover:underline"
                      style={{ background: 'transparent', padding: 0, border: 'none', display: 'inline-block' }}
                    >
                      {showAllComments ? 'Show fewer comments' : 'Show more comments…'}
                    </span>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
      
             {/* Content Flag Modal */}
       <ContentFlagModal
         isOpen={showFlagModal}
         onClose={() => setShowFlagModal(false)}
         contentType="community"
         contentId={post._id}
         contentPreview={post.content || 'No content available'}
         onSuccess={() => {
           setIsFlaggedLocal(true);
         }}
       />
       </div>
     </div>
   );
 };

export default Post;