// src/components/PostCreator.jsx

import React, { useState, useRef } from 'react';
import api from '../utils/api';

const PostCreator = ({ onPostCreated, currentUserId }) => {
  // If no user ID, show login prompt
  if (!currentUserId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Please log in to create posts.</p>
        <a 
          href="/login" 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Login
        </a>
      </div>
    );
  }
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && selectedFiles.length === 0) {
      setError('Please write something or add media to post');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      
      selectedFiles.forEach(file => {
        formData.append('media', file);
      });

      const response = await api.post('/community', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created successfully:', response.data); // Debug log

      // Clear form
      setContent('');
      setSelectedFiles([]);
      
      // Notify parent component to refresh posts
      if (onPostCreated) {
        onPostCreated(response.data);
      }

    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setError('');
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="post-creator">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          {/* Profile picture placeholder */}
          <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>

          {/* Input field */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with the community..."
            className="flex-grow ml-4 p-3 pl-6 border border-gray-300 rounded-lg outline-none transition duration-150 ease-in-out post-creator-input resize-none"
            rows="3"
            maxLength="2000"
          />

          {/* Post button */}
          <button 
            type="submit"
            disabled={isSubmitting || (!content.trim() && selectedFiles.length === 0)}
            className="ml-4 btn-post transition duration-150 ease-in-out flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>

        {/* File previews */}
        {selectedFiles.length > 0 && (
          <div className="ml-16 mb-4">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center">
                        {file.name}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-6 text-gray-600 ml-16 mb-4">
          {/* Action links/icons */}
          <button
            type="button"
            onClick={openFileSelector}
            className="flex items-center space-x-1 post-creator-link transition duration-150 ease-in-out hover:text-blue-600"
          >
            <span className="text-lg">🖼️</span>
            <span>Media ({selectedFiles.length}/5)</span>
          </button>
          <span className="text-sm text-gray-400">
            {content.length}/2000 characters
          </span>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm ml-16 mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default PostCreator;