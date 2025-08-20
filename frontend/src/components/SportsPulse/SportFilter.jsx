// src/components/SportsPulse/SportFilter.jsx
import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSportsPulse } from '../../context/SportsPulseContext';
import { CONTINENT_SPORT_POPULARITY } from '../../utils/apiConfig.js';
import { 
  FiTarget, FiZap, FiActivity, FiWind, FiAward, 
  FiTriangle, FiCircle, FiSquare, FiHeart, FiStar,
  FiShield, FiCrosshair
} from 'react-icons/fi';

const SportFilter = () => {
  const { state, actions } = useSportsPulse();
  const scrollContainerRef = useRef(null);

  const baseSports = [
    { id: 'all', name: 'All Sports', icon: FiTarget, color: '#6366F1' },
    { id: 'cricket', name: 'Cricket', icon: FiCircle, color: '#10B981' },
    { id: 'football', name: 'Football', icon: FiShield, color: '#F59E0B' },
    { id: 'basketball', name: 'Basketball', icon: FiCircle, color: '#EF4444' },
    { id: 'badminton', name: 'Badminton', icon: FiWind, color: '#8B5CF6' },
    { id: 'table tennis', name: 'Table Tennis', icon: FiZap, color: '#06B6D4' },
    { id: 'tennis', name: 'Tennis', icon: FiActivity, color: '#84CC16' },
    { id: 'golf', name: 'Golf', icon: FiCrosshair, color: '#F97316' },
    { id: 'hockey', name: 'Hockey', icon: FiSquare, color: '#3B82F6' },
    { id: 'swimming', name: 'Swimming', icon: FiWind, color: '#0EA5E9' },
    { id: 'athletics', name: 'Athletics', icon: FiStar, color: '#DC2626' },
    { id: 'boxing', name: 'Boxing', icon: FiTriangle, color: '#7C2D12' },
    { id: 'wrestling', name: 'Wrestling', icon: FiHeart, color: '#BE185D' }
  ];

  // Sort sports by popularity for the selected continent
  const sports = useMemo(() => {
    const popularityOrder = CONTINENT_SPORT_POPULARITY[state.selectedContinent] || [];
    const allSport = baseSports.find(s => s.id === 'all');
    const otherSports = baseSports.filter(s => s.id !== 'all');
    
    const sortedSports = otherSports.sort((a, b) => {
      const aIndex = popularityOrder.indexOf(a.id);
      const bIndex = popularityOrder.indexOf(b.id);
      const aPosition = aIndex === -1 ? popularityOrder.length : aIndex;
      const bPosition = bIndex === -1 ? popularityOrder.length : bIndex;
      return aPosition - bPosition;
    });
    
    return [allSport, ...sortedSports];
  }, [state.selectedContinent]);

  const handleSportToggle = (sportId) => {
    let newSelectedSports;
    if (sportId === 'all') newSelectedSports = ['all'];
    else {
      const currentSports = state.selectedSports.filter(s => s !== 'all');
      if (currentSports.includes(sportId)) {
        newSelectedSports = currentSports.filter(s => s !== sportId);
        if (newSelectedSports.length === 0) newSelectedSports = ['all'];
      } else newSelectedSports = [...currentSports, sportId];
    }
    actions.setSports(newSelectedSports);
  };

  const scrollSports = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 250;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const getSelectedCount = () => (state.selectedSports.includes('all') ? baseSports.length - 1 : state.selectedSports.length);

  return (
    <div className="sport-filter-wrapper">
      <div className="filter-header">
        <div className="filter-title">
          <h3>Sports Categories</h3>
          <span className="selected-count">
            {getSelectedCount()} of {sports.length - 1} selected
          </span>
        </div>
        
        <div className="filter-actions">
          <button 
            className="clear-filters-btn"
            onClick={() => actions.setSports(['all'])}
            disabled={state.selectedSports.includes('all')}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="sport-filter-container">
        <button 
          className="scroll-btn scroll-left"
          onClick={() => scrollSports('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="sport-filter-pills" ref={scrollContainerRef}>
          <AnimatePresence>
            {sports.map((sport, index) => {
              const isSelected = state.selectedSports.includes(sport.id) || 
                (sport.id !== 'all' && state.selectedSports.includes('all'));
              const IconComponent = sport.icon;

              return (
                <motion.button
                  key={sport.id}
                  className={`sport-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSportToggle(sport.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.15 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    '--sport-color': sport.color
                  }}
                >
                  <div className="pill-content">
                    <IconComponent className="sport-icon" />
                    <span className="sport-name">{sport.name}</span>
                    
                    {isSelected && sport.id !== 'all' && (
                      <motion.div
                        className="selected-indicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>

                  {isSelected && (
                    <motion.div
                      className="pill-background"
                      layoutId={`pill-bg-${sport.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <button 
          className="scroll-btn scroll-right"
          onClick={() => scrollSports('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      {/* Active filters summary */}
      {!state.selectedSports.includes('all') && state.selectedSports.length > 0 && (
        <motion.div 
          className="active-filters"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="filters-label">Active filters:</span>
          <div className="filter-tags">
            {state.selectedSports.map(sportId => {
              const sport = sports.find(s => s.id === sportId);
              return sport ? (
                <span 
                  key={sportId} 
                  className="filter-tag"
                  style={{ backgroundColor: sport.color }}
                >
                  {sport.name}
                  <button 
                    onClick={() => handleSportToggle(sportId)}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SportFilter;
