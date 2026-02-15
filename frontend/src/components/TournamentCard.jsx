// src/components/TournamentCard.jsx
import React, { useState } from 'react';
import { MapPin, Calendar, Dribbble, Sword, PersonStanding, Rocket, Award } from 'lucide-react';
import TournamentRegistrationModal from './TournamentRegistrationModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getSportIcon = (sport) => {
  switch (sport.toLowerCase()) {
    case 'football':
      return <Dribbble className="h-4 w-4 text-indigo-500" />;
    case 'cricket':
      return <Award className="h-4 w-4 text-indigo-500" />; // Example: bat and ball might be better
    case 'badminton':
      return <Sword className="h-4 w-4 text-indigo-500" />; // Example: badminton racket might be better
    case 'athletics':
      return <PersonStanding className="h-4 w-4 text-indigo-500" />;
    case 'basketball':
      return <Dribbble className="h-4 w-4 text-indigo-500" />; // Using the same as football for example
    case 'tennis':
      return <Sword className="h-4 w-4 text-indigo-500" />; // Using the same as badminton for example
    case 'running':
      return <Rocket className="h-4 w-4 text-indigo-500" />; // Runner icon
    case 'volleyball':
      return <Dribbble className="h-4 w-4 text-indigo-500" />;
    case 'kabaddi':
      return <PersonStanding className="h-4 w-4 text-indigo-500" />;
    default:
      return <Dribbble className="h-4 w-4 text-indigo-500" />;
  }
};


const TournamentCard = ({ tournament, isRegistered }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'join'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const statusClasses = {
    Open: 'bg-green-100 text-green-700',
    Upcoming: 'bg-blue-100 text-blue-700',
    Closed: 'bg-gray-100 text-gray-700',
    Ongoing: 'bg-purple-100 text-purple-700'
  };

  const handleRegister = async (formData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to register!");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post(`${baseUrl}/api/tournaments/${tournament._id}/register`, formData, config);
      alert("Successfully registered! Check your email for confirmation.");
      setIsModalOpen(false);
      // Optional: Refresh page or parent state to update counts
      // window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-300 flex flex-col h-full border border-gray-700 group">
        <div className="relative overflow-hidden h-48">
          <img
            src={tournament.image}
            alt={tournament.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
        </div>

        <div className="p-5 flex flex-col flex-1 relative">
          <div className="flex justify-between items-start mb-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusClasses[tournament.status] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
              {tournament.status}
            </span>
            <span className="flex items-center text-xs font-medium text-orange-400 bg-orange-900/30 px-2 py-1 rounded-lg border border-orange-500/20">
              {getSportIcon(tournament.sport)}
              <span className="ml-1.5">{tournament.sport}</span>
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-orange-400 transition-colors">
            {tournament.title}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{tournament.location}</span>
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>{tournament.dateRange}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <div className="text-center border-r border-gray-700">
              <p className="text-xs text-gray-500 uppercase">Teams</p>
              <p className="font-semibold text-gray-200">{tournament.registeredTeams}/{tournament.maxTeams}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase">Entry Fee</p>
              <p className="font-semibold text-green-400">${tournament.entryFee}</p>
            </div>
          </div>

          <div className="mt-auto pt-2">
            {tournament.status === 'Closed' ? (
              <button disabled className="w-full py-2.5 rounded-xl bg-gray-700 text-gray-500 cursor-not-allowed text-sm font-semibold border border-gray-600">
                Registration Closed
              </button>
            ) : isRegistered ? (
              <button disabled className="w-full py-2.5 rounded-xl bg-green-900/30 text-green-400 cursor-not-allowed text-sm font-semibold border border-green-500/30 flex items-center justify-center gap-2">
                <Award className="h-4 w-4" /> Registered
              </button>
            ) : tournament.registeredTeams >= tournament.maxTeams ? (
              <button disabled className="w-full py-2.5 rounded-xl bg-red-900/20 text-red-400 cursor-not-allowed text-sm font-semibold border border-red-800">
                Tournament Full
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setModalMode('create');
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20 text-sm font-bold flex items-center justify-center gap-2 transform active:scale-95"
                >
                  Register Team <Rocket className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setModalMode('join');
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 hover:bg-gray-700 transition-all text-sm font-semibold"
                >
                  Join Existing Team
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TournamentRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegister={handleRegister}
        tournamentTitle={tournament.title}
        tournamentId={tournament._id} // Pass ID for searching teams
        loading={loading}
        initialMode={modalMode}
      />
    </>
  );
};

export default TournamentCard;