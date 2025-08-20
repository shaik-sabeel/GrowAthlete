// src/components/SportsPulse/NewsCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSportsPulse } from '../../context/SportsPulseContext';
import { 
  FiBookmark, FiShare2, FiExternalLink, FiClock, 
  FiMapPin, FiTrendingUp, FiEye 
} from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaWhatsapp, FaLinkedin } from 'react-icons/fa';

const NewsCard = ({ article, index = 0 }) => {
  const { state, actions } = useSportsPulse();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const isBookmarked = state.bookmarks.includes(article.id);
  
  const handleBookmark = (e) => {
    e.stopPropagation();
    if (isBookmarked) {
      actions.removeBookmark(article.id);
    } else {
      actions.addBookmark(article.id);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const shareToSocial = (platform, e) => {
    e.stopPropagation();
    const url = encodeURIComponent(article.url);
    const title = encodeURIComponent(article.title);
    const description = encodeURIComponent(article.description || '');
    
    let shareUrl;
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleCardClick = () => {
    window.open(article.url, '_blank');
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - publishedDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return publishedDate.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      cricket: '#10B981',
      football: '#F59E0B',
      basketball: '#EF4444',
      tennis: '#84CC16',
      badminton: '#8B5CF6',
      'table tennis': '#06B6D4',
      golf: '#F97316',
      hockey: '#3B82F6',
      swimming: '#0EA5E9',
      athletics: '#DC2626',
      boxing: '#7C2D12',
      wrestling: '#BE185D',
      sports: '#6366F1'
    };
    return colors[category] || colors.sports;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  return (
    <motion.article
      className="news-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      onClick={handleCardClick}
    >
      {/* Category Badge */}
      <div 
        className="category-badge"
        style={{ backgroundColor: getCategoryColor(article.category) }}
      >
        {article.category || 'Sports'}
      </div>

      {/* Image Section */}
      <div className="card-image-container">
        {article.image && !imageError ? (
          <>
            <motion.img
              src={article.image}
              alt={article.title}
              className={`card-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            {!imageLoaded && <div className="image-skeleton" />}
          </>
        ) : (
          <div className="image-placeholder">
            <FiTrendingUp className="placeholder-icon" />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="image-overlay">
          <button 
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <FiBookmark />
          </button>
          
          <div className="share-container">
            <button 
              className="share-btn"
              onClick={handleShare}
              title="Share article"
            >
              <FiShare2 />
            </button>
            
            {showShareMenu && (
              <motion.div 
                className="share-menu"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={(e) => shareToSocial('twitter', e)}
                  className="share-option twitter"
                >
                  <FaTwitter />
                </button>
                <button 
                  onClick={(e) => shareToSocial('facebook', e)}
                  className="share-option facebook"
                >
                  <FaFacebook />
                </button>
                <button 
                  onClick={(e) => shareToSocial('whatsapp', e)}
                  className="share-option whatsapp"
                >
                  <FaWhatsapp />
                </button>
                <button 
                  onClick={(e) => shareToSocial('linkedin', e)}
                  className="share-option linkedin"
                >
                  <FaLinkedin />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="card-content">
        {/* Headline */}
        <h3 className="card-title">
          {truncateText(article.title, 100)}
        </h3>

        {/* Meta Info */}
        <div className="card-meta">
          <div className="meta-left">
            <span className="source">{article.source}</span>
            <span className="meta-separator">•</span>
            <span className="time">
              <FiClock className="time-icon" />
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          
          {article.continent && (
            <div className="meta-right">
              <FiMapPin className="location-icon" />
              <span className="location">{article.continent}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {article.description && (
          <p className="card-description">
            {truncateText(article.description, 150)}
          </p>
        )}

        {/* Read More Button */}
        <div className="card-actions">
          <motion.button 
            className="read-more-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            Read More
            <FiExternalLink className="external-icon" />
          </motion.button>
          
          {/* Additional indicators */}
          <div className="card-indicators">
            {state.trending.some(t => t.id === article.id) && (
              <span className="trending-indicator" title="Trending">
                <FiTrendingUp />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsCard;
