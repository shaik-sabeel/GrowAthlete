// src/components/SportsPulse/NewsGrid.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSportsPulse } from '../../context/SportsPulseContext';
import { fetchNews, searchNews, getTrendingNews } from '../../utils/sportsAPI';
import NewsCard from './NewsCard';
import LoadingSpinner from './LoadingSpinner';
import { FiRefreshCw, FiFilter, FiTrendingUp, FiSearch } from 'react-icons/fi';

const NewsGrid = () => {
  const { state, actions } = useSportsPulse();
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch news data
  const fetchNewsData = useCallback(async () => {
    try {
      actions.setLoading('news', true);
      actions.setError('news', null);

      let newsData;
      if (state.searchQuery.trim()) {
        newsData = await searchNews(
          state.searchQuery, 
          state.selectedContinent, 
          state.selectedSports
        );
      } else {
        newsData = await fetchNews(state.selectedContinent, state.selectedSports);
      }

      actions.setNews(newsData);
      actions.updateLastUpdated('news', Date.now());

      // Update new articles count (simulate real-time updates)
      const previousCount = state.news.length;
      if (newsData.length > previousCount) {
        actions.setNewArticlesCount(newsData.length - previousCount);
      }

    } catch (error) {
      console.error('Error fetching news:', error);
      actions.setError('news', error.message);
    }
  }, [state.selectedContinent, state.selectedSports, state.searchQuery, actions]);

  // Fetch trending news
  const fetchTrendingData = useCallback(async () => {
    try {
      const trendingData = await getTrendingNews();
      actions.setTrending(trendingData);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  }, [actions]);

  // Initial load and dependency changes
  useEffect(() => {
    fetchNewsData();
    fetchTrendingData();
  }, [fetchNewsData, fetchTrendingData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!state.autoRefresh) return;

    const newsInterval = setInterval(() => {
      fetchNewsData();
    }, 5 * 60 * 1000); // 5 minutes

    const trendingInterval = setInterval(() => {
      fetchTrendingData();
    }, 15 * 60 * 1000); // 15 minutes

    return () => {
      clearInterval(newsInterval);
      clearInterval(trendingInterval);
    };
  }, [state.autoRefresh, fetchNewsData, fetchTrendingData]);

  // Filter and sort news
  const filteredAndSortedNews = useMemo(() => {
    let filtered = [...state.news];

    // Filter by sports if not 'all'
    if (!state.selectedSports.includes('all')) {
      filtered = filtered.filter(article => 
        state.selectedSports.includes(article.category) ||
        state.selectedSports.some(sport => 
          article.title.toLowerCase().includes(sport.toLowerCase()) ||
          (article.description && article.description.toLowerCase().includes(sport.toLowerCase()))
        )
      );
    }

    // Sort articles
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case 'trending':
        filtered.sort((a, b) => {
          const aTrending = state.trending.some(t => t.id === a.id);
          const bTrending = state.trending.some(t => t.id === b.id);
          if (aTrending && !bTrending) return -1;
          if (!aTrending && bTrending) return 1;
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        });
        break;
      case 'source':
        filtered.sort((a, b) => a.source.localeCompare(b.source));
        break;
      default:
        break;
    }

    return filtered;
  }, [state.news, state.selectedSports, state.trending, sortBy]);

  const handleManualRefresh = () => {
    fetchNewsData();
    fetchTrendingData();
  };

  if (state.loading.news && state.news.length === 0) {
    return <LoadingSpinner message="Loading latest sports news..." />;
  }

  if (state.error.news && state.news.length === 0) {
    return (
      <div className="error-state">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Unable to load news</h3>
          <p>{state.error.news}</p>
          <button onClick={handleManualRefresh} className="retry-btn">
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-grid-container">
      {/* Header Controls */}
      <div className="news-grid-header">
        <div className="header-left">
          <h2 className="section-title">
            {state.searchQuery ? (
              <>
                <FiSearch />
                Search Results for "{state.searchQuery}"
              </>
            ) : (
              <>Latest Sports News</>
            )}
          </h2>
          <span className="news-count">
            {filteredAndSortedNews.length} articles
          </span>
        </div>

        <div className="header-controls">
          {/* Sort Options */}
          <div className="sort-controls">
            <FiFilter className="control-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="latest">Latest First</option>
              <option value="trending">Trending</option>
              <option value="source">By Source</option>
            </select>
          </div>

          {/* Manual Refresh */}
          <button 
            onClick={handleManualRefresh}
            className="refresh-btn"
            disabled={state.loading.news}
            title="Refresh news"
          >
            <FiRefreshCw className={state.loading.news ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Trending Section */}
      {state.trending.length > 0 && !state.searchQuery && (
        <motion.div 
          className="trending-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="trending-header">
            <FiTrendingUp />
            <span>Trending Now</span>
          </div>
          <div className="trending-articles">
            {state.trending.slice(0, 3).map((article, index) => (
              <motion.div
                key={article.id}
                className="trending-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="trending-rank">#{index + 1}</span>
                <span className="trending-title">{article.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {state.loading.news && state.news.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-indicator">
            <FiRefreshCw className="spinning" />
            Updating...
          </div>
        </div>
      )}

      {/* News Grid */}
      {filteredAndSortedNews.length > 0 ? (
        <motion.div 
          className={`news-grid ${viewMode}`}
          layout
        >
          <AnimatePresence>
            {filteredAndSortedNews.map((article, index) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">📰</div>
            <h3>No articles found</h3>
            <p>
              {state.searchQuery 
                ? `No articles match your search for "${state.searchQuery}"`
                : `No articles available for the selected filters`
              }
            </p>
            {state.searchQuery && (
              <button 
                onClick={() => actions.setSearchQuery('')}
                className="clear-search-btn"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Load More Button (for pagination in future) */}
      {filteredAndSortedNews.length > 0 && filteredAndSortedNews.length >= 20 && (
        <motion.div 
          className="load-more-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <button className="load-more-btn">
            Load More Articles
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default NewsGrid;
