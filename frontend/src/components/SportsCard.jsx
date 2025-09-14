// src/components/SportCard.jsx
import React from 'react';

const SportCard = ({ title, imageUrl, description }) => {
  return (
    <div
      className="relative w-full h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.7)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* This overlay creates the gradient effect for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 rounded-2xl"></div>
      <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white z-10">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 leading-tight">{title}</h3>
        {description && <p className="text-sm sm:text-base text-gray-200 line-clamp-2">{description}</p>}
      </div>
    </div>
  );
};

export default SportCard;