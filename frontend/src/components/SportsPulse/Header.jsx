// src/components/SportsPulse/Header.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSportsPulse } from '../../context/SportsPulseContext';
import { FiSearch, FiSun, FiMoon, FiRefreshCw, FiBell, FiBookmark } from 'react-icons/fi';

const Header = () => {
  const { state, actions } = useSportsPulse();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSearchChange = (e) => {
    actions.setSearchQuery(e.target.value);
  };

  return (
    <header className="sports-pulse-header">
      <div className="header-container">
        {/* Left Section - Logo & Status */}
        <div className="header-left">
          <motion.div 
            className="logo-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="app-title">SportsPulse</h1>
            <div className="status-indicators">
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span>Live</span>
              </div>
              <span className="last-updated">
                Updated {formatLastUpdated(state.lastUpdated.news)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <motion.div 
            className={`search-container ${isSearchFocused ? 'focused' : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search sports news..."
              value={state.searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="search-input"
            />
            {state.searchQuery && (
              <button 
                onClick={() => actions.setSearchQuery('')}
                className="clear-search"
              >
                ×
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Section - Controls */}
        <div className="header-right">
          <motion.div 
            className="header-controls"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Notifications */}
            <button 
              className="control-btn notifications-btn"
              title="Notifications"
            >
              <FiBell />
              {state.newArticlesCount > 0 && (
                <span className="notification-badge">{state.newArticlesCount}</span>
              )}
            </button>

            {/* Bookmarks */}
            <button 
              className="control-btn bookmarks-btn"
              title="Bookmarks"
            >
              <FiBookmark />
              {state.bookmarks.length > 0 && (
                <span className="bookmark-count">{state.bookmarks.length}</span>
              )}
            </button>

            {/* Auto Refresh Toggle */}
            <button 
              className={`control-btn refresh-btn ${state.autoRefresh ? 'active' : ''}`}
              onClick={actions.toggleAutoRefresh}
              title={`Auto-refresh ${state.autoRefresh ? 'on' : 'off'}`}
            >
              <FiRefreshCw className={state.autoRefresh ? 'rotating' : ''} />
            </button>

            {/* Theme Toggle */}
            <button 
              className="control-btn theme-btn"
              onClick={actions.toggleTheme}
              title={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {state.theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>

            {/* Current Time */}
            <div className="current-time">
              {currentTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
