// src/pages/TournamentsPage.jsx
import React from 'react';
import FilterSidebar from '../components/FilterSidebar';
import MapSection from '../components/MapSection';
import TournamentCard from '../components/TournamentCard';
import { tournaments } from '../data/tournaments'; // Import mock data

const TournamentsPage = () => {
  return (
    // This outer div provides the background and ensures content area height.
    // The `container mx-auto p-4` handles content alignment and spacing.
    // min-h-[calc(100vh - header_height - footer_height)] provides vertical space,
    // assuming Navbar is ~64px (h-16) and Footer is ~96px (py-6 from example) in small screen,
    // Adjust values (16, 24 for header/footer tailwind h-x, py-y equivalent) based on your actual Navbar and Footer heights
    <div className="bg-gray-50 min-h-[calc(100vh - 4rem - 6rem)] py-8"> {/* Adjusted min-h calc */}
      <div className="container mx-auto p-4 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <FilterSidebar />

        {/* Right Content Area: Map + Tournament Cards */}
        <div className="flex-1">
          <MapSection />

          {/* Tournament Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;