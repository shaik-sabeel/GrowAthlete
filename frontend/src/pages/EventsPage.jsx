// frontend/src/pages/EventsPage.jsx

import React, { useState, useEffect } from 'react';
// import api from '../utils/api'; // Commented out: No API call for static version
import Navbar from '../components/Navbar';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
// Link is no longer needed directly in this component as the button is removed
// import { Link } from 'react-router-dom'; 

// Dummy Static Event Data
const staticEvents = [
    {
        _id: '1',
        title: 'National Cricket Championship',
        description: 'Join us for the thrilling National Cricket Championship finals! Witness top teams battle for glory.',
        date: '2024-07-20T10:00:00Z',
        location: 'Wankhede Stadium, Mumbai',
        image: 'https://images.unsplash.com/photo-1543315053-cf019e24df29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', // Replace with a publicly accessible image URL or one in your /public folder
    },
    {
        _id: '2',
        title: 'Annual Marathon Challenge',
        description: 'Push your limits in our annual marathon, supporting youth sports programs. Various categories available.',
        date: '2024-08-10T06:00:00Z',
        location: 'Bandra Reclamation, Mumbai',
        image: 'https://images.unsplash.com/photo-1563232824-c11579d5558e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
        _id: '3',
        title: 'Youth Football Camp',
        description: 'An intensive football training camp for aspiring young footballers, focusing on skills and tactics.',
        date: '2024-07-28T09:00:00Z',
        location: 'Andheri Sports Complex, Mumbai',
        image: 'https://images.unsplash.com/photo-1587524933068-07ad79b47e27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
        _id: '4',
        title: 'Basketball Slam Dunk Contest',
        description: 'A spectacular showcase of dunks and aerial artistry from the best local basketball talent.',
        date: '2024-09-01T18:00:00Z',
        location: 'Worli Sports Arena, Mumbai',
        image: 'https://images.unsplash.com/photo-1546513426-ff602e86ef5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
        _id: '5',
        title: 'Badminton Doubles Tournament',
        description: 'Compete in the city\'s biggest badminton doubles tournament. Prizes for winners!',
        date: '2024-08-25T14:00:00Z',
        location: 'Goregaon Badminton Club, Mumbai',
        image: 'https://images.unsplash.com/photo-1579545083547-2c5e7b2f6f1c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
];

// Event Card Component (can be a separate file, but kept here for self-containment as requested)
const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-56 object-cover" 
        />
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
            <div className="flex items-center text-gray-600 mb-4 space-x-4">
                <p className="flex items-center text-sm sm:text-base">
                    <FaCalendarAlt className="mr-2 text-blue-500" /> 
                    {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="flex items-center text-sm sm:text-base">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" /> 
                    {event.location}
                </p>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">{event.description}</p>
        </div>
    </div>
);

const EventsPage = () => {
    const [events, setEvents] = useState(staticEvents);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Original backend fetching logic (commented out for static version)
    /*
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);
    */

    if (loading) return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <Navbar />
            <p className="text-center text-lg mt-20">Loading events...</p>
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <Navbar />
            <p className="text-center text-red-500 text-lg mt-20 px-4">{error}</p>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-10 md:mb-12">
                        Upcoming Events
                    </h1>

                    {/* REMOVED: Create New Event button for public view */}
                    {/*
                    <div className="text-center mb-12">
                        <Link 
                            to="/events/create" 
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create New Event
                        </Link>
                    </div>
                    */}

                    {events.length === 0 ? (
                        <p className="text-center text-gray-500 text-xl">
                            No upcoming events at the moment. Please check back later!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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