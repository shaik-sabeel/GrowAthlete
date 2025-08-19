// src/components/ImageCarousel.jsx

import React from 'react';
import sportShoeImage from '../assets/football.png'; // Import the image


const ImageCarousel = () => {
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center shadow-md">
      {/* The main image - MAKE SURE 'football.png' is in src/assets */}
      <img
        src={sportShoeImage}
        alt="Sport Shoe"
        className="w-full h-full object-cover"
      />

      {/* Left Navigation Arrow */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-3 rounded-full cursor-pointer hover:bg-opacity-100 transition duration-150 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Navigation Arrow */}
      <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-3 rounded-full cursor-pointer hover:bg-opacity-100 transition duration-150 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Adidas logo text placeholder */}
      <div className="absolute bottom-4 left-4 text-white text-3xl font-bold opacity-75">
        ADIDAS
      </div>
    </div>
  );
};

export default ImageCarousel;