// frontend/src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FaCalendarAlt, FaMapMarkerAlt, FaListUl, FaCalendarCheck } from 'react-icons/fa'; // Added new icons
import { Link } from 'react-router-dom';
import CalendarView from '../components/CalendarView'; // <-- IMPORT CALENDAR COMPONENT

const EventCard = ({ event }) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeDiff = eventDate.getTime() - now.getTime();
    // const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const daysDiff = Math.round((startOfDay(eventDate).getTime() - startOfDay(now).getTime()) / MS_PER_DAY);
    
    const getTimeStatus = () => {
        if (daysDiff < 0) return null;
        if (daysDiff === 0) return { text: "Today!", color: "text-red-600 bg-red-100" };
        if (daysDiff === 1) return { text: "Tomorrow", color: "text-orange-600 bg-orange-100" };
        if (daysDiff <= 7) return { text: `In ${daysDiff} days`, color: "text-yellow-600 bg-yellow-100" };
        return { text: `${daysDiff} days away`, color: "text-blue-600 bg-blue-100" };
    };

    const timeStatus = getTimeStatus();

    // Format event.date to include time if available
    const startTime = event.date ? new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const endTime = event.endDate ? new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';


    return (
        <div className="bg-[#30405a] rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <img
                src={`${import.meta.env.VITE_API_BASE_URL || 'https://growathlete-1.onrender.com'}${event.image}`}
                alt={event.title}
                className="w-full h-48 sm:h-56 object-cover"
            />
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">{event.title}</h3>
                    {timeStatus && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium self-start ${timeStatus.color}`}>
                            {timeStatus.text}
                        </span>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
                    <p className="flex text-white items-center text-xs sm:text-sm lg:text-base">
                        <FaCalendarAlt className="mr-2 text-white flex-shrink-0" />
                        <span className="truncate">{eventDate.toLocaleDateString()} {startTime && endTime && `(${startTime} - ${endTime})`}</span>
                    </p>
                    <p className="flex items-center text-white text-xs sm:text-sm lg:text-base">
                        <FaMapMarkerAlt className="mr-2 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </p>
                </div>
                <p className="text-white leading-relaxed text-sm sm:text-base line-clamp-3">{event.description}</p>
                <div className="mt-4">
                    <Link
                        to={`/events/${event._id}`}
                        className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        style={{color:'white'}}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

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
            <div className="bg-[#0F172A] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-white mb-8 md:mb-10 lg:mb-12" style={{color:'white'}}>
                        Upcoming Events
                    </h1>

                    {/* View Toggle Buttons */}
                    <div className="text-center mb-8 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center justify-center px-4 sm:px-6 py-3 rounded-md shadow-sm transition duration-300 text-sm sm:text-base
                                ${viewMode === 'list' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            <FaListUl className="mr-2" /> <span className="hidden xs:inline">List View</span><span className="xs:hidden">List</span>
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center justify-center px-4 sm:px-6 py-3 rounded-md shadow-sm transition duration-300 text-sm sm:text-base
                                ${viewMode === 'calendar' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            <FaCalendarCheck className="mr-2" /> <span className="hidden xs:inline">Calendar View</span><span className="xs:hidden">Calendar</span>
                        </button>
                    </div>

                    {events.length === 0 ? (
                        <p className="text-center text-gray-500 text-xl">
                            No upcoming events at the moment. Please check back later!
                        </p>
                    ) : (
                        viewMode === 'list' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                                {events.map(event => (
                                    <EventCard  key={event._id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <CalendarView events={events} />
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default EventsPage;