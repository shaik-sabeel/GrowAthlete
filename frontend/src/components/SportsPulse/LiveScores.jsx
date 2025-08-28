// src/components/SportsPulse/LiveScores.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSportsPulse } from '../../context/SportsPulseContext';
import { fetchLiveScores } from '../../utils/sportsAPI';
import LoadingSpinner from './LoadingSpinner';
import { 
  FiRefreshCw, FiPlay, FiPause, FiClock, 
  FiTrendingUp, FiActivity, FiZap 
} from 'react-icons/fi';

const LiveScores = () => {
  const { state, actions } = useSportsPulse();
  const [expandedMatch, setExpandedMatch] = useState(null);

  // Fetch live scores
  const fetchScoresData = useCallback(async () => {
    try {
      actions.setLoading('scores', true);
      actions.setError('scores', null);

      const scoresData = await fetchLiveScores();
      actions.setLiveScores(scoresData);
      actions.updateLastUpdated('scores', Date.now());

    } catch (error) {
      console.error('Error fetching live scores:', error);
      actions.setError('scores', error.message);
    }
  }, [actions]);

  // Initial load
  useEffect(() => {
    fetchScoresData();
  }, [fetchScoresData]);

  // Auto-refresh for live scores
  useEffect(() => {
    if (!state.autoRefresh) return;

    const interval = setInterval(() => {
      fetchScoresData();
    }, 30 * 1000); // 30 seconds

    return () => clearInterval(interval);
  }, [state.autoRefresh, fetchScoresData]);

  const getMatchStatus = (status, progress) => {
    if (status === 'Match Finished') return { text: 'FT', color: '#6B7280', icon: null };
    if (status === 'Not Started') return { text: 'NS', color: '#F59E0B', icon: FiClock };
    if (progress) return { text: progress, color: '#10B981', icon: FiPlay };
    if (status === 'Live') return { text: 'LIVE', color: '#EF4444', icon: FiActivity };
    return { text: status || 'TBD', color: '#6B7280', icon: null };
  };

  const formatDateTime = (date, time) => {
    if (!date) return '';
    
    try {
      const matchDate = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':');
        matchDate.setHours(parseInt(hours), parseInt(minutes));
      }
      
      const now = new Date();
      const diffDays = Math.floor((matchDate - now) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays > 1) return `In ${diffDays} days`;
      if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
      
      return matchDate.toLocaleDateString();
    } catch {
      return date;
    }
  };

  const handleManualRefresh = () => {
    fetchScoresData();
  };

  const toggleMatchExpanded = (matchId) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  if (state.loading.scores && state.liveScores.length === 0) {
    return (
      <div className="live-scores-container">
        <div className="scores-header">
          <h3>Live Scores</h3>
        </div>
        <LoadingSpinner message="Loading live scores..." size="small" />
      </div>
    );
  }

  return (
    <div className="live-scores-container">
      {/* Header */}
      <div className="scores-header">
        <div className="header-title">
          <h3>Live Scores</h3>
          <div className="live-indicator">
            <div className="live-dot pulsing"></div>
            <span>Live</span>
          </div>
        </div>
        
        <div className="header-controls">
          <button 
            onClick={handleManualRefresh}
            className="refresh-btn"
            disabled={state.loading.scores}
            title="Refresh scores"
          >
            <FiRefreshCw className={state.loading.scores ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {state.loading.scores && state.liveScores.length > 0 && (
        <div className="scores-loading-overlay">
          <FiRefreshCw className="spinning" />
        </div>
      )}

      {/* Error State */}
      {state.error.scores && state.liveScores.length === 0 && (
        <div className="scores-error">
          <div className="error-content">
            <FiZap className="error-icon" />
            <p>Unable to load live scores</p>
            <button onClick={handleManualRefresh} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Scores List */}
      <div className="scores-list">
        {state.liveScores.length > 0 ? (
          <AnimatePresence>
            {state.liveScores.slice(0, 10).map((match, index) => {
              const matchStatus = getMatchStatus(match.status, match.progress);
              const StatusIcon = matchStatus.icon;
              const isExpanded = expandedMatch === match.id;

              return (
                <motion.div
                  key={match.id}
                  className={`score-card ${isExpanded ? 'expanded' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleMatchExpanded(match.id)}
                >
                  {/* Match Status */}
                  <div 
                    className="match-status"
                    style={{ color: matchStatus.color }}
                  >
                    {StatusIcon && <StatusIcon className="status-icon" />}
                    <span className="status-text">{matchStatus.text}</span>
                  </div>

                  {/* Teams and Scores */}
                  <div className="match-teams">
                    <div className="team home-team">
                      {match.homeTeamBadge && (
                        <img 
                          src={match.homeTeamBadge} 
                          alt={match.homeTeam}
                          className="team-logo"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <span className="team-name">{match.homeTeam || 'TBD'}</span>
                      <span className="team-score">{match.homeScore || '-'}</span>
                    </div>

                    <div className="match-vs">vs</div>

                    <div className="team away-team">
                      <span className="team-score">{match.awayScore || '-'}</span>
                      <span className="team-name">{match.awayTeam || 'TBD'}</span>
                      {match.awayTeamBadge && (
                        <img 
                          src={match.awayTeamBadge} 
                          alt={match.awayTeam}
                          className="team-logo"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="match-info">
                    <span className="match-sport">{match.sport}</span>
                    {match.league && (
                      <>
                        <span className="info-separator">•</span>
                        <span className="match-league">{match.league}</span>
                      </>
                    )}
                  </div>

                  {/* Date/Time */}
                  <div className="match-time">
                    <FiClock className="time-icon" />
                    <span>{formatDateTime(match.date, match.time)}</span>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="expanded-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="match-details">
                          {match.league && (
                            <div className="detail-item">
                              <span className="detail-label">League:</span>
                              <span className="detail-value">{match.league}</span>
                            </div>
                          )}
                          
                          {match.date && (
                            <div className="detail-item">
                              <span className="detail-label">Date:</span>
                              <span className="detail-value">
                                {new Date(match.date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          {match.time && (
                            <div className="detail-item">
                              <span className="detail-label">Time:</span>
                              <span className="detail-value">{match.time}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : !state.loading.scores && !state.error.scores ? (
          <div className="empty-scores">
            <div className="empty-content">
              <FiActivity className="empty-icon" />
              <p>No live matches right now</p>
              <small>Check back later for live scores</small>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      {state.liveScores.length > 0 && (
        <div className="scores-footer">
          <div className="last-updated">
            <FiClock className="clock-icon" />
            <span>
              Updated {state.lastUpdated.scores 
                ? new Date(state.lastUpdated.scores).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })
                : 'Never'
              }
            </span>
          </div>
          
          {state.autoRefresh && (
            <div className="auto-refresh-indicator">
              <FiRefreshCw className="refresh-icon" />
              <span>Auto-updating</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveScores;
