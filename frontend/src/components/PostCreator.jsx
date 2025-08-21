// src/components/PostCreator.jsx

import React from 'react';

const PostCreator = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {/* Profile picture placeholder */}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>

        {/* Input field */}
        <input
          type="text"
          placeholder="Share something with the community..."
          className="flex-grow ml-4 p-2 pl-6 border border-gray-300 rounded-full outline-none transition duration-150 ease-in-out post-creator-input"
        />

        {/* Post button */}
        <button className="ml-4 btn-post transition duration-150 ease-in-out flex-shrink-0">
          Post
        </button>
      </div>

      <div className="flex items-center space-x-6 text-gray-600 ml-16 mb-4">
        {/* Action links/icons */}
        <a href="#" className="flex items-center space-x-1 post-creator-link transition duration-150 ease-in-out">
          <span className="text-lg">🖼️</span>
          <span>Image</span>
        </a>
        <a href="#" className="flex items-center space-x-1 post-creator-link transition duration-150 ease-in-out">
          <span className="text-lg">😊</span>
          <span>Feeling</span>
        </a>
      </div>

      {/* Error message */}
      <div className="text-red-500 text-sm ml-16 mt-2">
        Error: Failed to fetch
      </div>
    </div>
  );
};

export default PostCreator;