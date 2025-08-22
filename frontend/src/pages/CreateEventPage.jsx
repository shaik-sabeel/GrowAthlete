import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const eventData = new FormData();
        eventData.append('title', formData.title);
        eventData.append('description', formData.description);
        eventData.append('date', formData.date);
        eventData.append('location', formData.location);
        if (image) {
            eventData.append('image', image);
        }

        try {
            await api.post('/events', eventData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Event created successfully!');
            setTimeout(() => navigate('/events'), 2000); // Redirect after 2 seconds
        } catch (err) {
            console.error('Error creating event:', err);
            setError(err.response?.data?.message || 'Failed to create event.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-24 pb-12 px-4">
                <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Create New Event</h1>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
                    {message && <p className="text-green-500 bg-green-100 p-3 rounded mb-4">{message}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Event Title"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Event Description"
                            rows="4"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                         <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                         <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Event Location (e.g., Mumbai, India)"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                         <div>
                            <label className="block text-gray-700 font-semibold mb-2">Event Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
                        >
                            Create Event
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateEventPage;