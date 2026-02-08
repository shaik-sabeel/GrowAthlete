// src/pages/CreateTournamentPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trophy, MapPin, Calendar, DollarSign, Users, FileText } from 'lucide-react';

const CreateTournamentPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        sport: '',
        location: '',
        startDate: '',
        endDate: '',
        entryFee: 0,
        prizePool: '',
        maxTeams: 16,
        description: '',
        image: '',
        status: 'Upcoming'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            // Get token from storage
            const token = localStorage.getItem('token'); // Assuming token is stored here

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.post(`${baseUrl}/api/tournaments`, formData, config);
            navigate('/tournaments');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create tournament');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-25 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 py-6 px-8">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy className="h-6 w-6" /> Create New Tournament
                    </h1>
                    <p className="text-indigo-100 mt-1">Fill in the details to launch a new competition.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tournament Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. Summer City League 2024"
                            />
                        </div>

                        {/* Sport */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                            <select
                                name="sport"
                                required
                                value={formData.sport}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select Sport</option>
                                <option value="Football">Football</option>
                                <option value="Cricket">Cricket</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Tennis">Tennis</option>
                                <option value="Badminton">Badminton</option>
                                <option value="Volleyball">Volleyball</option>
                                <option value="Athletics">Athletics</option>
                                <option value="Running">Running</option>
                                <option value="Kabaddi">Kabaddi</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Location</div>
                            </label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="City, Stadium/Venue"
                            />
                        </div>

                        {/* Dates */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Start Date</div>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> End Date</div>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Fees & Prize */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Entry Fee ($)</div>
                            </label>
                            <input
                                type="number"
                                name="entryFee"
                                min="0"
                                value={formData.entryFee}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center gap-1"><Trophy className="h-4 w-4" /> Prize Pool</div>
                            </label>
                            <input
                                type="text"
                                name="prizePool"
                                value={formData.prizePool}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. $1000 + Trophies"
                            />
                        </div>

                        {/* Teams */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center gap-1"><Users className="h-4 w-4" /> Max Teams</div>
                            </label>
                            <input
                                type="number"
                                name="maxTeams"
                                min="2"
                                value={formData.maxTeams}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Upcoming">Upcoming</option>
                                <option value="Open">Open for Registration</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        {/* Image URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave blank to use a default placeholder.</p>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center gap-1"><FileText className="h-4 w-4" /> Description</div>
                            </label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Describe the tournament details, format, etc."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/tournaments')}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating...' : 'Create Tournament'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentPage;
