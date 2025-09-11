// src/pages/SavedArticlesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Color palette constants
const COLORS = {
  navy: '#13293D',
  orange: '#D98022',
  beige: '#F8F4EB',
  charcoal: '#222831',
  soft: '#ECECEC'
};

const SavedArticlesPage = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedArticles, setExpandedArticles] = useState(new Set());

  useEffect(() => {
    // Load saved article IDs from localStorage
    const savedBookmarks = localStorage.getItem('growathlete_bookmarks');
    if (savedBookmarks) {
      try {
        const bookmarksArray = JSON.parse(savedBookmarks);
        setSavedArticles(bookmarksArray);
      } catch (error) {
        console.error('Error loading saved articles:', error);
      }
    }
    setLoading(false);
  }, []);

  const removeFromSaved = (articleId) => {
    const updatedArticles = savedArticles.filter(id => id !== articleId);
    setSavedArticles(updatedArticles);
    localStorage.setItem('growathlete_bookmarks', JSON.stringify(updatedArticles));
  };

  // Helper function to create article summary (1-2 lines)
  const createSummary = (description, maxLength = 120) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    
    // Find the last complete sentence within the limit
    const truncated = description.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );
    
    if (lastSentenceEnd > maxLength * 0.7) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }
    
    return truncated + '...';
  };

  // Check if an article is expanded
  const isExpanded = (articleId) => expandedArticles.has(articleId);

  // Toggle article expansion
  const toggleExpansion = (articleId) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const styles = {
    page: { 
      minHeight: '100vh', 
      background: 'bg-[#30405a]', 
      color: COLORS.charcoal, 
      fontFamily: 'Inter, sans-serif',
      paddingTop: '80px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: 'white',
      margin: '0 0 1rem 0',
      textShadow: '2px 2px 4px rgba(19, 41, 61, 0.1)'
    },
    subtitle: {
      color: 'white',
      fontSize: '1.1rem',
      margin: '0 0 2rem 0',
      opacity: 0.8
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: COLORS.charcoal
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      opacity: 0.5
    },
    emptyTitle: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
      color: 'white',
      fontWeight: 600
    },
    emptyText: {
      marginBottom: '2rem',
      color: 'gray',
      opacity: 0.7
    },
    backButton: {
      background: COLORS.orange,
      color: COLORS.beige,
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 600,
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(217, 128, 34, 0.3)'
    },
    articleList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem'
    },
    articleCard: {
      background: COLORS.beige,
      border: `2px solid ${COLORS.soft}`,
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(19, 41, 61, 0.1)'
    },
    articleImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    articleContent: {
      padding: '1.5rem'
    },
    articleTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      margin: '0 0 0.75rem 0',
      lineHeight: 1.4,
      color: COLORS.charcoal
    },
    articleMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: COLORS.charcoal,
      fontSize: '0.875rem',
      marginBottom: '1rem',
      opacity: 0.7
    },
    removeButton: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#EF4444',
      border: '2px solid rgba(239, 68, 68, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 600,
      transition: 'all 0.3s ease'
    },
    readMoreLink: {
      color: COLORS.orange,
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
      transition: 'color 0.3s ease'
    },
    articleSummary: {
      color: COLORS.charcoal,
      fontSize: '0.875rem',
      lineHeight: 1.6,
      marginBottom: '1rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    articleDescriptionExpanded: {
      color: COLORS.charcoal,
      fontSize: '0.875rem',
      lineHeight: 1.6,
      marginBottom: '1rem',
      animation: 'fadeIn 0.3s ease-in-out'
    },
    expandButton: {
      background: 'transparent',
      border: 'none',
      color: COLORS.orange,
      fontSize: '0.75rem',
      fontWeight: 600,
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      marginBottom: '0.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div>⏳ Loading saved articles...</div>
          </div>
        </div>
      </div>
    );
  }

  if (savedArticles.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📚</div>
            <h2 style={styles.emptyTitle}>No Saved Articles</h2>
            <p style={styles.emptyText}>
              You haven't saved any articles yet. Start exploring the news and click the star button to save articles for later reading.
            </p>
            <Link to="/news" style={styles.backButton}>
              Browse Sports News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Saved Articles</h1>
          <p style={styles.subtitle}>
            {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''} saved for later reading
          </p>
        </div>

        <div style={styles.articleList}>
          {savedArticles.map((articleId, index) => (
            <div key={articleId} style={styles.articleCard}>
              <div style={styles.articleContent}>
                <h3 style={styles.articleTitle}>
                  Saved Article #{index + 1}
                </h3>
                <div style={styles.articleMeta}>
                  <span>Article ID: {articleId}</span>
                  <button
                    style={styles.removeButton}
                    onClick={() => removeFromSaved(articleId)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    Remove
                  </button>
                </div>
                <p style={{ color: COLORS.charcoal, marginBottom: '1rem', opacity: 0.7 }}>
                  This article was saved from the sports news feed. 
                  Note: Article details are not stored locally for privacy reasons.
                </p>
                <Link to="/news" style={styles.readMoreLink}>
                  Back to News →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedArticlesPage;
