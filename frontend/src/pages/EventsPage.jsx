import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

// Event Card Component (nested for simplicity, can be a separate file)
const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <img 
            src={`http://localhost:5000/${event.image}`} 
            alt={event.title}
            className="w-full h-56 object-cover" 
        />
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
            <div className="flex items-center text-gray-600 mb-4 space-x-4">
                <p className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" /> 
                    {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" /> 
                    {event.location}
                </p>
            </div>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>
    </div>
);

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError('Failed to load events.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <p className="text-center text-lg mt-20">Loading events...</p>;
    if (error) return <p className="text-center text-red-500 text-lg mt-20">{error}</p>;

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
                        Upcoming Events
                    </h1>
                    {events.length === 0 ? (
                        <p className="text-center text-gray-500 text-xl">No upcoming events at the moment. Please check back later!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map(event => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EventsPage;