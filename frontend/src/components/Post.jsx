// src/components/Post.jsx

import React, { useState } from 'react';
import { FaFlag, FaEllipsisH } from 'react-icons/fa';
import ContentFlagModal from './ContentFlagModal';

// You might have actual user profile pictures in your assets
// For now, let's use a generic placeholder or keep it simple.
import userPlaceholder from '../assets/soham.jpg'; // Assuming 'soham.jpg' is a user profile pic

const Post = () => {
  const [showFlagModal, setShowFlagModal] = useState(false);
  
  const samplePost = {
    id: 'post-1',
    user: {
      name: 'User A. Sporty',
      profilePic: userPlaceholder, // Use your actual user profile image path
    },
    content: "Had a great training session today! Consistency is key. #FitnessGoals #TrainHard",
    likes: 125,
    comments: [
      { id: 1, user: 'Fan B.', text: 'Awesome work! Keep pushing!' },
      { id: 2, user: 'Coach C.', text: 'Great dedication. Remember your warm-downs!' },
      { id: 3, user: 'Teammate D.', text: 'See you on the field next week! 🙌' },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4"> {/* Added mt-4 for spacing from PostCreator */}
      {/* User Info Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* User Picture */}
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <img
              src={samplePost.user.profilePic}
              alt={samplePost.user.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* User Name */}
          <p className="font-semibold text-gray-800 ml-3">{samplePost.user.name}</p>
        </div>
        
        {/* Post Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowFlagModal(true)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
            title="Flag post"
          >
            <FaFlag />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-4 pl-12">{samplePost.content}</p> {/* Aligned with user name */}

      {/* Like and Comment Buttons */}
      <div className="flex items-center space-x-6 text-gray-600 border-b border-gray-200 pb-3 mb-4 pl-12">
        <button className="flex items-center space-x-1 action-btn-like transition duration-150 ease-in-out">
          <span className="text-xl">👍</span> {/* Like icon */}
          <span>Like ({samplePost.likes})</span>
        </button>
        <button className="flex items-center space-x-1 action-btn-comment transition duration-150 ease-in-out">
          <span className="text-xl">💬</span> {/* Comment icon */}
          <span>Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="pl-12">
        {samplePost.comments.map((comment) => (
          <div key={comment.id} className="mb-2">
            <span className="font-semibold text-gray-800 mr-2">{comment.user}</span>
            <span className="text-gray-700">{comment.text}</span>
          </div>
        ))}
        {/* Input for new comments, if desired (optional) */}
        {/* <input
          type="text"
          placeholder="Write a comment..."
          className="mt-3 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
        /> */}
      </div>
      
      {/* Content Flag Modal */}
      <ContentFlagModal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        contentType="community"
        contentId={samplePost.id}
        contentPreview={samplePost.content}
      />
    </div>
  );
};

export default Post;