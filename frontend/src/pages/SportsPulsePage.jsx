// src/pages/SportsPulsePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/SportsPulse/Header';
import ContinentTabs from '../components/SportsPulse/ContinentTabs';
import SportFilter from '../components/SportsPulse/SportFilter';
import NewsGrid from '../components/SportsPulse/NewsGrid';
import LiveScores from '../components/SportsPulse/LiveScores';
import LoadingSpinner from '../components/SportsPulse/LoadingSpinner';
import { SportsPulseProvider } from '../context/SportsPulseContext';
import '../pages_css/SportsPulse.css';

const SportsPulsePage = () => {
  return (
    <SportsPulseProvider>
      <div className="sports-pulse-page">
        <Header />
        <main className="sports-pulse-main">
          <div className="sports-pulse-container">
            <ContinentTabs />
            <SportFilter />
            
            <div className="sports-pulse-content">
              <div className="news-section">
                <NewsGrid />
              </div>
              <div className="live-scores-section">
                <LiveScores />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SportsPulseProvider>
  );
};

export default SportsPulsePage;
