// src/components/SportsPulse/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'loading-small',
    medium: 'loading-medium',
    large: 'loading-large'
  };

  return (
    <div className={`loading-spinner-container ${sizeClasses[size]}`}>
      <div className="loading-content">
        {/* Animated Spinner */}
        <motion.div 
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </motion.div>

        {/* Loading Message */}
        <motion.p 
          className="loading-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {message}
        </motion.p>

        {/* Animated Dots */}
        <div className="loading-dots">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="loading-dot"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-badge"></div>
      </div>
      
      <div className="skeleton-image"></div>
      
      <div className="skeleton-content">
        <div className="skeleton-title">
          <div className="skeleton-line long"></div>
          <div className="skeleton-line medium"></div>
        </div>
        
        <div className="skeleton-meta">
          <div className="skeleton-line short"></div>
          <div className="skeleton-line short"></div>
        </div>
        
        <div className="skeleton-description">
          <div className="skeleton-line long"></div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
        </div>
        
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

// Skeleton loader for score cards
export const SkeletonScore = () => {
  return (
    <div className="skeleton-score">
      <div className="skeleton-status"></div>
      
      <div className="skeleton-teams">
        <div className="skeleton-team">
          <div className="skeleton-logo"></div>
          <div className="skeleton-name"></div>
          <div className="skeleton-score-value"></div>
        </div>
        
        <div className="skeleton-vs">vs</div>
        
        <div className="skeleton-team">
          <div className="skeleton-score-value"></div>
          <div className="skeleton-name"></div>
          <div className="skeleton-logo"></div>
        </div>
      </div>
      
      <div className="skeleton-info">
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
