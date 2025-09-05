// src/pages/NewsPage_SportsPulse.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../utils/sportsAPI';
import { API_CONFIG } from '../utils/apiConfig';

// Color palette constants
const COLORS = {
  navy: '#13293D',
  orange: '#D98022',
  beige: '#F8F4EB',
  charcoal: '#222831',
  soft: '#ECECEC'
};

const continents = [
  { key: 'indian', label: 'Indian', icon: '🇮🇳' },
  { key: 'asian', label: 'Asian', icon: '🌏' },
  { key: 'european', label: 'European', icon: '🇪🇺' },
  { key: 'australian', label: 'Australian', icon: '🇦🇺' },
  { key: 'american', label: 'American', icon: '🌎' },
  { key: 'african', label: 'African', icon: '🌍' }
];

const sports = [
  { key: 'all', label: 'All Sports' },
  { key: 'cricket', label: 'Cricket' },
  { key: 'football', label: 'Football' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'tennis', label: 'Tennis' }
];

const NewsPage_SportsPulse = () => {
  const [continent, setContinent] = useState('indian');
  const [sport, setSport] = useState('all');
  const [news, setNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [expandedArticles, setExpandedArticles] = useState(new Set());

  // Check if API key is available
  const NEWSDATA_API_KEY = import.meta?.env?.VITE_NEWSDATA_API_KEY || API_CONFIG.NEWSDATA.API_KEY;

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('growathlete_bookmarks');
    if (savedBookmarks) {
      try {
        const bookmarksArray = JSON.parse(savedBookmarks);
        setBookmarkedArticles(new Set(bookmarksArray));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    const bookmarksArray = Array.from(bookmarkedArticles);
    localStorage.setItem('growathlete_bookmarks', JSON.stringify(bookmarksArray));
  }, [bookmarkedArticles]);

  // Toggle bookmark for an article
  const toggleBookmark = (articleId) => {
    setBookmarkedArticles(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(articleId)) {
        newBookmarks.delete(articleId);
      } else {
        newBookmarks.add(articleId);
      }
      return newBookmarks;
    });
  };

  // Check if an article is bookmarked
  const isBookmarked = (articleId) => bookmarkedArticles.has(articleId);

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

  const load = async (c = continent, s = sport) => {
    setLoading(true);
    setError('');
    try {
      const items = await getNews(c, s);
      
      // Set breaking news (first/latest article)
      if (items && items.length > 0) {
        setBreakingNews(items[0]);
        setNews(items.slice(1)); // Rest of the news
      } else {
        setBreakingNews(null);
        setNews([]);
      }
      
      setLastUpdated(new Date());
    } catch (e) {
      setError('Could not load news, try again later');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { document.documentElement.setAttribute('data-theme','dark'); }, []);

  useEffect(() => { load(continent, sport); }, [continent, sport]);

  useEffect(() => {
    const id = setInterval(() => load(continent, sport), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [continent, sport]);

  const styles = {
    page: { 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${COLORS.beige} 0%, ${COLORS.soft} 100%)`, 
      color: COLORS.charcoal, 
      fontFamily: 'Inter, sans-serif' 
    },
    header: { 
      background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1a3a52 100%)`, 
      padding: '3rem 1rem 2rem', 
      marginTop: 80, 
      textAlign: 'center', 
      position: 'relative',
      boxShadow: '0 4px 20px rgba(19, 41, 61, 0.3)'
    },
    title: { 
      fontSize: '3.5rem', 
      fontWeight: 800, 
      color: COLORS.beige, 
      margin: 0,
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    titleAccent: { 
      height: 6, 
      width: 120, 
      margin: '15px auto 0', 
      borderRadius: 9999, 
      background: `linear-gradient(90deg, ${COLORS.orange}, #ff6b35)`,
      boxShadow: '0 2px 8px rgba(217, 128, 34, 0.4)'
    },
    updated: { 
      color: COLORS.soft, 
      marginTop: 12, 
      fontSize: 14,
      fontWeight: 500
    },
    main: { 
      maxWidth: 1400, 
      margin: '0 auto', 
      padding: '2rem 1rem' 
    },
    filterBar: { 
      display: 'flex', 
      gap: '0.75rem', 
      flexWrap: 'wrap', 
      justifyContent: 'center', 
      margin: '2rem 0',
      padding: '1.5rem',
      background: COLORS.beige,
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(19, 41, 61, 0.1)'
    },
    btn: (active) => ({ 
      background: active ? COLORS.orange : COLORS.soft, 
      border: `2px solid ${active ? COLORS.orange : COLORS.charcoal}`, 
      color: active ? COLORS.beige : COLORS.charcoal, 
      padding: '0.75rem 1.5rem', 
      borderRadius: 25, 
      cursor: 'pointer', 
      fontSize: 14, 
      fontWeight: 600,
      display: 'flex', 
      alignItems: 'center', 
      gap: 8,
      transition: 'all 0.3s ease',
      boxShadow: active ? '0 4px 12px rgba(217, 128, 34, 0.3)' : '0 2px 6px rgba(34, 40, 49, 0.1)',
      transform: active ? 'translateY(-2px)' : 'translateY(0)'
    }),
    icon: { fontSize: 18 },
    
    // Breaking News Styles
    breakingNewsContainer: {
      background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1a3a52 100%)`,
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px rgba(19, 41, 61, 0.3)',
      position: 'relative'
    },
    breakingNewsHeader: {
      background: COLORS.orange,
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    breakingNewsLabel: {
      color: COLORS.beige,
      fontWeight: 700,
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    breakingNewsContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      padding: '2rem'
    },
    breakingNewsImage: {
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative'
    },
    breakingNewsText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    breakingNewsTitle: {
      fontSize: '2rem',
      fontWeight: 700,
      color: COLORS.beige,
      marginBottom: '1rem',
      lineHeight: 1.3
    },
    breakingNewsDescription: {
      fontSize: '1.1rem',
      color: COLORS.soft,
      lineHeight: 1.6,
      marginBottom: '1.5rem'
    },
    breakingNewsSummary: {
      fontSize: '1.1rem',
      color: COLORS.soft,
      lineHeight: 1.6,
      marginBottom: '1.5rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    breakingNewsDescriptionExpanded: {
      fontSize: '1.1rem',
      color: COLORS.soft,
      lineHeight: 1.6,
      marginBottom: '1.5rem',
      animation: 'fadeIn 0.3s ease-in-out'
    },
    breakingNewsExpandButton: {
      background: 'rgba(217, 128, 34, 0.2)',
      border: '1px solid rgba(217, 128, 34, 0.4)',
      color: COLORS.beige,
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      padding: '6px 12px',
      borderRadius: '15px',
      transition: 'all 0.3s ease',
      marginBottom: '1rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    breakingNewsMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: COLORS.soft,
      fontSize: '0.9rem'
    },
    breakingNewsBookmark: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'rgba(0,0,0,0.7)',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '20px',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(4px)'
    },
    
    // Regular News Grid
    grid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
      gap: '1.5rem' 
    },
    card: { 
      background: COLORS.beige, 
      border: `2px solid ${COLORS.soft}`, 
      borderRadius: 16, 
      overflow: 'hidden', 
      position: 'relative',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(19, 41, 61, 0.1)'
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(19, 41, 61, 0.2)',
      borderColor: COLORS.orange
    },
    bookmarkBtn: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'rgba(255,255,255,0.9)',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    bookmarkIcon: (isBookmarked) => ({
      color: isBookmarked ? COLORS.orange : COLORS.charcoal,
      filter: isBookmarked ? 'drop-shadow(0 0 4px rgba(217, 128, 34, 0.5))' : 'none',
      transition: 'all 0.3s ease'
    }),
    cardContent: { 
      padding: '1.5rem' 
    },
    cardTitle: { 
      margin: '0 0 0.75rem 0', 
      fontSize: 18, 
      fontWeight: 600,
      lineHeight: 1.4, 
      color: COLORS.charcoal,
      display: '-webkit-box', 
      WebkitLineClamp: 2, 
      WebkitBoxOrient: 'vertical', 
      overflow: 'hidden'
    },
    cardDescription: {
      color: COLORS.charcoal,
      fontSize: 14,
      lineHeight: 1.6,
      marginBottom: '1rem'
    },
    cardSummary: {
      color: COLORS.charcoal,
      fontSize: 14,
      lineHeight: 1.6,
      marginBottom: '1rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    cardDescriptionExpanded: {
      color: COLORS.charcoal,
      fontSize: 14,
      lineHeight: 1.6,
      marginBottom: '1rem',
      animation: 'fadeIn 0.3s ease-in-out'
    },
    expandButton: {
      background: 'transparent',
      border: 'none',
      color: COLORS.orange,
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      marginBottom: '0.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    },
    expandButtonHover: {
      background: 'rgba(217, 128, 34, 0.1)',
      transform: 'translateY(-1px)'
    },
    cardMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: COLORS.charcoal,
      fontSize: 12,
      fontWeight: 500
    },
    readMoreLink: {
      color: COLORS.orange,
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: 14,
      transition: 'color 0.3s ease'
    },
    
    // Loading and Error States
    loadingContainer: {
      textAlign: 'center',
      padding: '3rem',
      color: COLORS.charcoal
    },
    errorContainer: {
      textAlign: 'center',
      padding: '2rem',
      background: '#fee2e2',
      borderRadius: 12,
      color: '#dc2626',
      margin: '1rem 0'
    },
    retryButton: {
      background: COLORS.orange,
      color: COLORS.beige,
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: 600,
      marginLeft: '1rem',
      transition: 'all 0.3s ease'
    }
  };

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
      <header style={styles.header}>
        <h1 style={styles.title}>Sports News</h1>
        <div style={styles.titleAccent}></div>
        {lastUpdated && <div style={styles.updated}>Updated {lastUpdated.toLocaleTimeString()}</div>}
        {bookmarkedArticles.size > 0 && (
          <div style={{ 
            marginTop: '20px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              padding: '10px 20px', 
              background: 'rgba(217, 128, 34, 0.2)', 
              border: '2px solid rgba(217, 128, 34, 0.4)', 
              borderRadius: '25px',
              fontSize: '14px',
              color: COLORS.beige,
              fontWeight: 600
            }}>
              ⭐ {bookmarkedArticles.size} article{bookmarkedArticles.size !== 1 ? 's' : ''} saved for later
            </div>
            <Link 
              to="/saved-articles" 
              style={{
                padding: '10px 20px',
                background: 'rgba(248, 244, 235, 0.2)',
                border: '2px solid rgba(248, 244, 235, 0.4)',
                borderRadius: '25px',
                fontSize: '14px',
                color: COLORS.beige,
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(248, 244, 235, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(248, 244, 235, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View Saved Articles
            </Link>
          </div>
        )}
      </header>

      <main style={styles.main}>
        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
            {continents.map(c => (
              <button 
                key={c.key} 
                style={styles.btn(continent===c.key)} 
                onClick={()=>setContinent(c.key)}
                onMouseEnter={(e) => {
                  if (continent !== c.key) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(34, 40, 49, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (continent !== c.key) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(34, 40, 49, 0.1)';
                  }
                }}
              >
                <span style={styles.icon}>{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {sports.map(s => (
              <button 
                key={s.key} 
                style={styles.btn(sport===s.key)} 
                onClick={()=>setSport(s.key)}
                onMouseEnter={(e) => {
                  if (sport !== s.key) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(34, 40, 49, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sport !== s.key) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(34, 40, 49, 0.1)';
                  }
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breaking News Section */}
        {breakingNews && (
          <div style={styles.breakingNewsContainer}>
            <div style={styles.breakingNewsHeader}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              <span style={styles.breakingNewsLabel}>Breaking News</span>
              <span style={{ 
                background: COLORS.beige, 
                color: COLORS.orange, 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                LIVE
              </span>
            </div>
            <div style={styles.breakingNewsContent}>
              {breakingNews.image && (
                <div style={styles.breakingNewsImage}>
                  <img 
                    src={breakingNews.image} 
                    alt={breakingNews.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                  />
                  <button
                    style={styles.breakingNewsBookmark}
                    onClick={() => toggleBookmark(breakingNews.id)}
                    title={isBookmarked(breakingNews.id) ? 'Remove from bookmarks' : 'Save for later'}
                  >
                    <span style={styles.bookmarkIcon(isBookmarked(breakingNews.id))}>
                      {isBookmarked(breakingNews.id) ? '⭐' : '☆'}
                    </span>
                  </button>
                </div>
              )}
              <div style={styles.breakingNewsText}>
                <h2 style={styles.breakingNewsTitle}>{breakingNews.title}</h2>
                {breakingNews.description && (
                  <>
                    {isExpanded(breakingNews.id) ? (
                      <p style={styles.breakingNewsDescriptionExpanded}>{breakingNews.description}</p>
                    ) : (
                      <p style={styles.breakingNewsSummary}>{createSummary(breakingNews.description, 150)}</p>
                    )}
                  </>
                )}
                <div style={styles.breakingNewsMeta}>
                  <span>{breakingNews.source || 'Sports News'}</span>
                  <span>{breakingNews.publishedAt ? new Date(breakingNews.publishedAt).toLocaleDateString() : ''}</span>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {breakingNews.description && breakingNews.description.length > 150 && (
                    <button
                      style={styles.breakingNewsExpandButton}
                      onClick={() => toggleExpansion(breakingNews.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(217, 128, 34, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(217, 128, 34, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {isExpanded(breakingNews.id) ? (
                        <>↑ Read Less</>
                      ) : (
                        <>↓ Read More</>
                      )}
                    </button>
                  )}
                  <a 
                    href={breakingNews.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={styles.readMoreLink}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = COLORS.navy;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = COLORS.orange;
                    }}
                  >
                    Full Story →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading latest sports news...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.errorContainer}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️</div>
            <div style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</div>
            <button 
              onClick={() => load(continent, sport)} 
              style={styles.retryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c2651a';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.orange;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && !breakingNews && (
          <div style={{ textAlign: 'center', padding: '3rem', color: COLORS.charcoal }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No news found</div>
            <div>Try adjusting your filters or check back later for updates</div>
          </div>
        )}

        {/* Regular News Grid */}
        {news.length > 0 && (
          <div style={styles.grid}>
            {news.map(a => (
              <article 
                key={a.id} 
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(19, 41, 61, 0.2)';
                  e.currentTarget.style.borderColor = COLORS.orange;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(19, 41, 61, 0.1)';
                  e.currentTarget.style.borderColor = COLORS.soft;
                }}
              >
                {a.image && (
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={a.image} 
                      alt={a.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                    />
                    <button
                      style={styles.bookmarkBtn}
                      onClick={() => toggleBookmark(a.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(217, 128, 34, 0.9)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title={isBookmarked(a.id) ? 'Remove from bookmarks' : 'Save for later'}
                    >
                      <span style={styles.bookmarkIcon(isBookmarked(a.id))}>
                        {isBookmarked(a.id) ? '⭐' : '☆'}
                      </span>
                    </button>
                  </div>
                )}
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{a.title}</h3>
                  {a.description && (
                    <>
                      {isExpanded(a.id) ? (
                        <p style={styles.cardDescriptionExpanded}>{a.description}</p>
                      ) : (
                        <p style={styles.cardSummary}>{createSummary(a.description, 100)}</p>
                      )}
                    </>
                  )}
                  <div style={styles.cardMeta}>
                    <span>{a.source || 'Sports News'}</span>
                    <span>{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}</span>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {a.description && a.description.length > 100 && (
                      <button
                        style={styles.expandButton}
                        onClick={() => toggleExpansion(a.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(217, 128, 34, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {isExpanded(a.id) ? (
                          <>↑ Read Less</>
                        ) : (
                          <>↓ Read More</>
                        )}
                      </button>
                    )}
                    <a 
                      href={a.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={styles.readMoreLink}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = COLORS.navy;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = COLORS.orange;
                      }}
                    >
                      Full Article →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsPage_SportsPulse;
