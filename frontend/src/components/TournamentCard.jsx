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


const TournamentCard = ({ tournament }) => {
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <img src={tournament.image} alt={tournament.title} className="w-full h-40 object-cover" />
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-black mb-2 leading-tight" style={{ color: 'black' }}>
            {tournament.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mb-1">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{tournament.dateRange}</span>
          </div>

          <div className="flex items-center justify-between text-sm mb-4 mt-auto">
            <span className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-gray-700">
              {getSportIcon(tournament.sport)}
              <span className="ml-1">{tournament.sport}</span>
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[tournament.status] || 'bg-gray-100'}`}>
              {tournament.status}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 mb-4 px-1">
            <span>Teams: {tournament.registeredTeams}/{tournament.maxTeams}</span>
            <span>Fee: ${tournament.entryFee}</span>
          </div>

          {/* Only show buttons if tournament is open/upcoming and not full */
            /* Actually, logic: 
               - If Closed -> Show Closed
               - If Full -> Show Full
               - Else -> Show Register & Join buttons (if applicable)
            */
          }
          {tournament.status === 'Closed' ? (
            <button disabled className="w-full py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed text-sm font-medium">
              Registration Closed
            </button>
          ) : tournament.registeredTeams >= tournament.maxTeams ? (
            <button disabled className="w-full py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed text-sm font-medium">
              Tournament Full
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  setModalMode('create');
                  setIsModalOpen(true);
                }}
                className="w-full py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Register Now
              </button>
              <button
                onClick={() => {
                  setModalMode('join');
                  setIsModalOpen(true);
                }}
                className="w-full py-2 rounded-md bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Join Team
              </button>
            </div>
          )}
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