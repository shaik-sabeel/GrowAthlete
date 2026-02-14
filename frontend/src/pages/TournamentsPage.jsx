// src/pages/TournamentsPage.jsx
import React from 'react';
import FilterSidebar from '../components/FilterSidebar';
import MapSection from '../components/MapSection';
import TournamentCard from '../components/TournamentCard';
import axios from 'axios';
import { useState, useEffect } from 'react';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    location: '',
    startDate: '',
    endDate: '',
    category: '',
    sortBy: 'Date (Upcoming)'
  });

  const [registeredTournamentIds, setRegisteredTournamentIds] = useState(new Set());

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${baseUrl}/api/tournaments`);
        console.log("Fetched tournaments:", data);
        if (data.success) {
          setTournaments(data.data);
        } else {
          setTournaments(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };

    const fetchMyRegistrations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const { data } = await axios.get(`${baseUrl}/api/tournaments/my-registrations`, config);
        if (data.success) {
          const ids = new Set(data.data.map(t => t._id));
          setRegisteredTournamentIds(ids);
        }
      } catch (error) {
        console.error("Error fetching my registrations:", error);
      }
    };

    fetchTournaments();
    fetchMyRegistrations();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sport: '',
      location: '',
      startDate: '',
      endDate: '',
      category: '',
      sortBy: 'Date (Upcoming)'
    });
  };

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSport = filters.sport && filters.sport !== 'Select a sport' ? t.sport === filters.sport : true;
    const matchesLocation = t.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesCategory = filters.category && filters.category !== 'Select category' ? t.category === filters.category : true; // Assuming category exists or remove if not in model yet

    // Date filtering (basic implementation)
    let matchesDate = true;
    if (filters.startDate) {
      matchesDate = matchesDate && new Date(t.startDate) >= new Date(filters.startDate);
    }
    if (filters.endDate) {
      matchesDate = matchesDate && new Date(t.endDate) <= new Date(filters.endDate);
    }

    return matchesSearch && matchesSport && matchesLocation && matchesCategory && matchesDate;
  }).sort((a, b) => {
    if (filters.sortBy === 'Date (Upcoming)') return new Date(a.startDate) - new Date(b.startDate);
    if (filters.sortBy === 'Date (Past)') return new Date(b.startDate) - new Date(a.startDate);
    if (filters.sortBy === 'Alphabetical (A-Z)') return a.title.localeCompare(b.title);
    if (filters.sortBy === 'Location') return a.location.localeCompare(b.location);
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[90vh] min-h-[210px] mb-8 overflow-hidden group mt-4 md:mt-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-100"
          style={{
            backgroundImage: "url('https://www.shutterstock.com/image-photo/sport-athletes-action-grand-arena-600nw-2678985273.jpg')",
          }}
        >
        </div>

        {/* Gradient Overlay for Text Readability - lighter at top for image clarity, darker at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight mb-2 uppercase drop-shadow-2xl font-bebas transform translate-y-0 transition-transform duration-500" style={{ color: 'white' }}>
            TOURNAMENTS
          </h1>
          <div className="h-1 w-24 bg-orange-500 mb-6 rounded-full"></div>
          <p className="text-xl md:text-3xl text-white font-light max-w-3xl drop-shadow-lg tracking-wide">
            Discover and compete in sports events across India
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 pb-16 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Filters - Sticky on Desktop */}
        <div className="lg:w-72 lg:flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
          </div>
        </div>

        {/* Right Content Area: Map + Tournament Cards */}
        <div className="flex-1">
          {/* Admin Action Bar */}
          {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'admin' && (
            <div className="mb-6 flex justify-end">
              <a
                href="/tournaments/create"
                className="bg-orange-600 text-white px-6 py-2.5 rounded-full hover:bg-orange-700 transition shadow-lg font-medium flex items-center gap-2 transform hover:scale-105 duration-200"
              >
                + Create Tournament
              </a>
            </div>
          )}

          <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <MapSection tournaments={filteredTournaments} />
          </div>

          {/* Tournament Cards Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-200">{error}</div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">No tournaments found matching your criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-orange-600 font-medium hover:underline">Clear all filters</button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-3">
                  Upcoming Events <span className="text-gray-400 font-normal text-lg ml-2">({filteredTournaments.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament._id}
                    tournament={tournament}
                    isRegistered={registeredTournamentIds.has(tournament._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;