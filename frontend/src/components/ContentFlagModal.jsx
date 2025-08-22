import React, { useState } from 'react';
import { FaFlag, FaTimes, FaExclamationTriangle, FaBan, FaCommentSlash, FaUserSlash, FaNewspaper } from 'react-icons/fa';
import api from '../utils/api';

const ContentFlagModal = ({ isOpen, onClose, contentType, contentId, contentPreview }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flagReasons = [
    { value: 'spam', label: 'Spam', icon: <FaCommentSlash />, description: 'Unwanted promotional content' },
    { value: 'inappropriate', label: 'Inappropriate', icon: <FaBan />, description: 'Content that violates community guidelines' },
    { value: 'harassment', label: 'Harassment', icon: <FaUserSlash />, description: 'Bullying or abusive behavior' },
    { value: 'fake_news', label: 'Fake News', icon: <FaNewspaper />, description: 'Misleading or false information' },
    { value: 'violence', label: 'Violence', icon: <FaExclamationTriangle />, description: 'Promotes or glorifies violence' },
    { value: 'other', label: 'Other', icon: <FaFlag />, description: 'Other violations not listed above' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason) {
      alert('Please select a reason for flagging this content.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let endpoint = '';
      switch (contentType) {
        case 'community':
          endpoint = `/moderation/community-posts/${contentId}/flag`;
          break;
        case 'blog':
          endpoint = `/moderation/blog-posts/${contentId}/flag`;
          break;
        case 'comment':
          endpoint = `/moderation/comments/${contentId}/flag`;
          break;
        default:
          throw new Error('Invalid content type');
      }

      await api.post(endpoint, { reason, description });
      
      // Reset form and close modal
      setReason('');
      setDescription('');
      onClose();
      
      // Show success message
      alert('Content flagged successfully. Our moderation team will review it.');
      
    } catch (error) {
      console.error('Failed to flag content:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message === 'You have already flagged this post') {
        alert('You have already flagged this content.');
      } else {
        alert('Failed to flag content. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaFlag className="text-red-500" />
            <h3 className="text-lg font-medium text-gray-900">Flag Inappropriate Content</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Preview */}
          {contentPreview && (
            <div className="p-3 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Preview</label>
              <div className="text-sm text-gray-600">
                {contentPreview}
              </div>
            </div>
          )}

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Flagging <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {flagReasons.map((flagReason) => (
                <label
                  key={flagReason.value}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    reason === flagReason.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={flagReason.value}
                    checked={reason === flagReason.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-indigo-600">{flagReason.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{flagReason.label}</div>
                      <div className="text-sm text-gray-500">{flagReason.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Please provide any additional context that will help our moderation team understand the issue..."
              disabled={isSubmitting}
            />
          </div>

          {/* Important Notice */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="text-yellow-600" />
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> Please only flag content that genuinely violates our community guidelines. 
                False reports may result in account restrictions.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason || isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaFlag />
                  <span>Flag Content</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentFlagModal;
