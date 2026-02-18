// src/components/TournamentRegistrationModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Trophy, Search, Users, UserPlus } from 'lucide-react';
import axios from 'axios';

const TournamentRegistrationModal = ({ isOpen, onClose, onRegister, tournamentTitle, tournamentId, loading: parentLoading, initialMode = 'create' }) => {
    const [mode, setMode] = useState(initialMode); // 'create' or 'join'
    const [formData, setFormData] = useState({
        teamName: '',
        email: '',
        phoneNumber: '',
        age: '',
        gender: 'Male',
        teamSize: 1
    });

    // Join Mode State
    const [searchTerm, setSearchTerm] = useState('');
    const [teams, setTeams] = useState([]);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [joinLoading, setJoinLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            if (initialMode === 'join') {
                fetchTeams();
            }
        }
    }, [isOpen, initialMode]);

    const fetchTeams = async () => {
        setLoadingTeams(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const { data } = await axios.get(`${baseUrl}/api/tournaments/${tournamentId}/teams`, config);
            if (data.success) {
                console.log("DEBUG: Fetched Teams:", data.data); // Debug log
                setTeams(data.data);
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
        } finally {
            setLoadingTeams(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(formData);
    };

    const handleJoinTeam = async (teamId) => {
        setJoinLoading(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.post(`${baseUrl}/api/tournaments/${tournamentId}/join`, { teamId }, config);
            alert("Successfully joined the team!");
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to join team");
        } finally {
            setJoinLoading(false);
        }
    };

    const filteredTeams = teams.filter(team =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        {mode === 'create' ? 'Register Team' : 'Join Team'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-indigo-100 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Mode Switcher (Optional, but good for context) */}
                <div className="flex border-b border-gray-200 shrink-0">
                    <button
                        className={`flex-1 py-3 text-sm font-medium ${mode === 'create' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setMode('create')}
                    >
                        Create Team
                    </button>
                    <button
                        className={`flex-1 py-3 text-sm font-medium ${mode === 'join' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => {
                            setMode('join');
                            if (teams.length === 0) fetchTeams();
                        }}
                    >
                        Join Team
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <p className="text-gray-600 mb-6 text-sm" style={{ color: "black" }}>
                        Tournament: <strong>{tournamentTitle}</strong>
                    </p>

                    {mode === 'create' ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1" style={{ color: "black" }}  >
                                    Team / Participant Name
                                </label>
                                <input
                                    type="text"
                                    name="teamName"
                                    value={formData.teamName}
                                    onChange={handleChange}
                                    placeholder="Enter your name or team name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 " style={{ color: "black" }}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                                    Team Size (Total Members)
                                </label>
                                <input
                                    type="number"
                                    name="teamSize"
                                    value={formData.teamSize}
                                    onChange={handleChange}
                                    placeholder="e.g. 5 for Basketball"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    required
                                    min="1"
                                    max="50"
                                />
                                <p className="text-xs text-gray-500 mt-1">Include yourself in this count.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+1 234..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contact@example.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="18"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        required
                                        min="5"
                                        max="99"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={parentLoading}
                                    className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors ${parentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {parentLoading ? 'Registering...' : 'Register Team'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // JOIN MODE
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search team name..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" style={{ color: "black" }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                                {loadingTeams ? (
                                    <div className="text-center py-4 text-gray-500">Loading teams...</div>
                                ) : filteredTeams.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500">No teams found matching your search.</div>
                                ) : (
                                    filteredTeams.map(team => (
                                        <div key={team._id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                            <div>
                                                <h4 className="font-semibold text-gray-800" style={{ color: "black" }}>
                                                    {team.teamName && team.teamName.trim() !== "" ? team.teamName : "Unnamed Team"}
                                                </h4>
                                                <p className="text-xs text-gray-500" style={{ color: "black" }}>
                                                    Organizer: {team.organizer && team.organizer.trim() !== "" ? team.organizer : "Unknown Organizer"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Members: {team.currentMembers}/{team.teamSize}
                                                </p>
                                                {team.slotsAvailable === 0 && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                                        Regret: No slots left
                                                    </span>
                                                )}
                                            </div>

                                            {team.slotsAvailable > 0 ? (
                                                <button
                                                    onClick={() => handleJoinTeam(team._id)}
                                                    disabled={joinLoading}
                                                    className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                    Join
                                                </button>
                                            ) : (
                                                <button disabled className="px-3 py-1.5 bg-gray-200 text-gray-400 text-sm rounded-md cursor-not-allowed">
                                                    Full
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TournamentRegistrationModal;
