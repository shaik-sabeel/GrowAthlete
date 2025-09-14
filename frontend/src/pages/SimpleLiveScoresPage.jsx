// Simple working Live Scores page
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SimpleLiveScoresPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="px-4 sm:px-6 lg:px-8 pt-20 pb-8 max-w-7xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 lg:p-12 rounded-2xl border border-gray-200 shadow-sm">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Live Scores
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6">
              Real-time Sports Scores & Match Updates
            </p>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Updates
            </div>
          </div>
        </header>

        {/* Live Scores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Live Cricket Match */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              LIVE
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">Mumbai Indians</span>
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">185</span>
              </div>
              <div className="text-center text-sm text-gray-500 my-2">vs</div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">Chennai Super Kings</span>
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">178</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-medium text-indigo-600">Cricket</span>
                <span>•</span>
                <span>IPL</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🕐</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Live Football Match */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <span>78'</span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">Manchester City</span>
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">2</span>
              </div>
              <div className="text-center text-sm text-gray-500 my-2">vs</div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">Liverpool</span>
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">1</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-medium text-indigo-600">Football</span>
                <span>•</span>
                <span>Premier League</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🕐</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Completed Basketball Game */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <span>FT</span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">Lakers</span>
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">108</span>
              </div>
              <div className="text-center text-sm text-gray-500 my-2">vs</div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">Warriors</span>
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">95</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-medium text-indigo-600">Basketball</span>
                <span>•</span>
                <span>NBA</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🕐</span>
                <span>Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-indigo-50 rounded-lg text-center border border-indigo-200">
          <p className="text-indigo-600 text-sm sm:text-base m-0">
            ⚽ Live Scores - Real-time match updates and scores from around the world
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SimpleLiveScoresPage;
