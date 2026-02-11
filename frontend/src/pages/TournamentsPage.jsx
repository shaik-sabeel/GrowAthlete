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
    <div className="bg-gray-50 min-h-[calc(100vh - 4rem - 6rem)] py-8">
      <div className="container mx-auto p-4 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />

        {/* Right Content Area: Map + Tournament Cards */}
        <div className="flex-1">
          {/* Admin Action Bar */}
          {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'admin' && (
            <div className="mb-6 flex justify-end">
              <a
                href="/tournaments/create"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-medium flex items-center gap-2"
              >
                + Create Tournament
              </a>
            </div>
          )}

          <MapSection tournaments={filteredTournaments} />

          {/* Tournament Cards Grid */}
          {loading ? (
            <div className="text-center py-10">Loading tournaments...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-10">No tournaments found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament._id}
                  tournament={tournament}
                  isRegistered={registeredTournamentIds.has(tournament._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;