// src/components/MyRegistrations.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Trophy } from 'lucide-react';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const token = localStorage.getItem('token');
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const res = await axios.get(`${baseUrl}/api/tournaments/my-registrations`, config);
                setRegistrations(res.data.data);
            } catch (err) {
                console.error("Error fetching registrations:", err);
                setError("Failed to load registrations.");
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    if (loading) return <p className="text-gray-500">Loading your tournaments...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (registrations.length === 0) return (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">You haven't registered for any tournaments yet.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ color: 'black' }} >
                <Trophy className="h-5 w-5 text-indigo-600" /> My Tournaments
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {registrations.map((tournament) => (
                    <div key={tournament._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5"  >
                        <h3 className="font-bold text-lg text-gray-900 mb-2" style={{ color: 'black' }}>{tournament.title}</h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-800">
                                <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                                {tournament.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-800">
                                <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                                {tournament.dateRange}
                            </div>
                            {/* Display Organizer if available */}
                            {tournament.organizer && (
                                <div className="text-sm text-gray-700 mt-1">
                                    <span className="font-semibold">Organizer:</span> {tournament.organizer.name}
                                </div>
                            )}

                            {/* Display Members */}
                            {tournament.members && tournament.members.length > 0 && (
                                <div className="text-sm text-gray-700 mt-2">
                                    <span className="font-semibold">Team Members ({tournament.members.length}):</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {tournament.members.map((member, index) => (
                                            <span key={member._id || index} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                {member.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                                <span className="text-xs text-gray-600 block font-medium">Team/Name</span>
                                <span className="font-bold text-gray-900 text-sm">{tournament.teamName}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${tournament.registrationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                                tournament.registrationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {tournament.registrationStatus}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRegistrations;
