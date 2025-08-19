// src/components/Sidebar.jsx

import React from 'react';

// Import your sport icons from the assets folder
// Make sure these paths are correct relative to THIS component file.
// import generalIcon from '../assets/images/general.png'; // Assuming a general chat icon exists or use a simple emoji/SVG
// import cricketIcon from '../assets/images/cricket.png';
// import footballIcon from '../assets/images/football.png';
// import hockeyIcon from '../assets/images/hockey.png';
// import volleyballIcon from '../assets/images/volleyball.png'; // Placeholder if you don't have one
// import tennisIcon from '../assets/images/tennis.png';     // Placeholder if you don't have one
// import otherSportsIcon from '../assets/images/other_sports.png'; // Placeholder if you don't have one
// import blogsIcon from '../assets/images/blogs.png';       // Placeholder if you don't have one


const Sidebar = () => {
  const categories = [
    { name: 'General', icon: generalIcon || '💬' }, // Fallback to emoji if image is not present
    { name: 'Cricket', icon: cricketIcon },
    { name: 'Football', icon: footballIcon },
    { name: 'Hockey', icon: hockeyIcon },
    { name: 'Volleyball', icon: volleyballIcon || '🏐' },
    { name: 'Tennis', icon: tennisIcon || '🎾' },
    { name: 'Other Sports', icon: otherSportsIcon || '🏆' },
    { name: 'All Blogs', icon: blogsIcon || '📰' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="font-bold text-lg mb-4 pb-4 border-b border-gray-200">Community</h2>
      <nav className="flex-grow">
        <ul>
          {categories.map((category, index) => (
            <li key={index} className="mb-2">
              <a href="#" className="flex items-center space-x-3 py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer transition duration-150 ease-in-out">
                {typeof category.icon === 'string' && category.icon.length > 2 ? (
                  <img src={category.icon} alt={category.name} className="h-6 w-6 object-contain" />
                ) : (
                  <span className="text-xl">{category.icon}</span> // For emojis if image path is not provided
                )}
                <span>{category.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 transition duration-150 ease-in-out">
          AI Analytics
        </button>
      </div>
    </div>
  );
};

export default Sidebar;