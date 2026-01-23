// src/components/MapSection.jsx
import React from 'react';

const MapSection = () => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Tournament Locations</h2>
      <div className="relative w-full overflow-hidden rounded-md h-56 md:h-72">
        <img
          src="/map_locations.png" // Path to your map image
          alt="Map of tournament locations"
          className="w-full h-full object-cover"
        />
        {/* Potentially add interactive pins here if needed in future */}
        {/* For now, the image itself shows the pins */}
      </div>
    </div>
  );
};

export default MapSection;