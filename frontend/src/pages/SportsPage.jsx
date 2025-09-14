// src/pages/SportsPage.jsx
import React from 'react';
import SportCard from '../components/SportsCard';
import sportsData from '../data/sportsData'; // Import the sports data

const SportsPage = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center tracking-wide mb-8 sm:mb-12" style={{color:'white'}}>
          Explore Your Favorite Sports
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
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
    </div>
  );
};

export default SportsPage;