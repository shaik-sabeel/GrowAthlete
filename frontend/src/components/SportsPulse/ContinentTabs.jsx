// src/components/SportsPulse/ContinentTabs.jsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useSportsPulse } from '../../context/SportsPulseContext';

const ContinentTabs = () => {
  const { state, actions } = useSportsPulse();
  const scrollContainerRef = useRef(null);

  const continents = [
    { 
      name: 'Indian', 
      flag: '🇮🇳', 
      color: '#FF6B35',
      countries: ['India']
    },
    { 
      name: 'Asian', 
      flag: '🌏', 
      color: '#4ECDC4',
      countries: ['China', 'Japan', 'Korea', 'Thailand', 'Malaysia', 'Singapore', 'Indonesia']
    },
    { 
      name: 'European', 
      flag: '🇪🇺', 
      color: '#45B7D1',
      countries: ['UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands']
    },
    { 
      name: 'Australian', 
      flag: '🇦🇺', 
      color: '#96CEB4',
      countries: ['Australia', 'New Zealand']
    },
    { 
      name: 'American', 
      flag: '🌎', 
      color: '#FFEAA7',
      countries: ['USA', 'Canada', 'Brazil', 'Argentina', 'Mexico']
    },
    { 
      name: 'African', 
      flag: '🌍', 
      color: '#FD79A8',
      countries: ['Nigeria', 'South Africa', 'Egypt', 'Kenya', 'Morocco']
    }
  ];

  const handleTabClick = (continentName) => {
    actions.setContinent(continentName);
  };

  const scrollTabs = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="continent-tabs-wrapper">
      <div className="continent-tabs-container">
        <button 
          className="scroll-btn scroll-left"
          onClick={() => scrollTabs('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="continent-tabs" ref={scrollContainerRef}>
          {continents.map((continent, index) => (
            <motion.button
              key={continent.name}
              className={`continent-tab ${
                state.selectedContinent === continent.name ? 'active' : ''
              }`}
              onClick={() => handleTabClick(continent.name)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                '--tab-color': continent.color
              }}
            >
              <div className="tab-content">
                <span className="tab-flag">{continent.flag}</span>
                <div className="tab-info">
                  <span className="tab-name">{continent.name}</span>
                  <span className="tab-countries">
                    {continent.countries.slice(0, 2).join(', ')}
                    {continent.countries.length > 2 && ' +'}
                  </span>
                </div>
              </div>
              
              {state.selectedContinent === continent.name && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <button 
          className="scroll-btn scroll-right"
          onClick={() => scrollTabs('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      {/* Selected continent info */}
      <motion.div 
        className="selected-continent-info"
        key={state.selectedContinent}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="continent-details">
          <span className="continent-label">Showing news from</span>
          <span className="continent-name">{state.selectedContinent}</span>
          <span className="continent-countries">
            {continents
              .find(c => c.name === state.selectedContinent)
              ?.countries.join(', ')}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ContinentTabs;
