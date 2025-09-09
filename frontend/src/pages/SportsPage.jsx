// src/pages/SportsPage.jsx
import React from 'react';
import SportCard from '../components/SportsCard';
import sportsData from '../data/sportsData'; // Import the sports data

const SportsPage = () => {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <h1 className="text-5xl py-25 font-extrabold text-white text-center tracking-wide" style={{color:'white'}}>
        Explore Your Favorite Sports
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {sportsData.map((sport, index) => (
          <SportCard
            key={index}
            title={sport.title}
            imageUrl={sport.imageUrl}
            description={sport.description}
          />
        ))}
      </div>
    </div>
  );
};

export default SportsPage;