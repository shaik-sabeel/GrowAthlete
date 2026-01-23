// src/components/TournamentCard.jsx
import React from 'react';
import { MapPin, Calendar, Dribbble, Sword, PersonStanding, Rocket, Award } from 'lucide-react'; 
// Assuming lucide-react or similar for icons, map icon example shown on image.

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
  const statusClasses = {
    Open: 'bg-green-100 text-green-700',
    Upcoming: 'bg-blue-100 text-blue-700',
    Closed: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img src={tournament.image} alt={tournament.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
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

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-gray-700">
            {getSportIcon(tournament.sport)}
            <span className="ml-1">{tournament.sport}</span>
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[tournament.status]}`}>
            {tournament.status}
          </span>
        </div>

        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;