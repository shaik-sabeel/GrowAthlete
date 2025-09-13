import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const EventDetailPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [organizerName, setOrganizerName] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        const resolveOrganizer = async () => {
            if (!event) return;
            try {
                if (event.organizer && typeof event.organizer === 'object') {
                    const nameFromObj = event.organizer.name || event.organizer.username || '';
                    if (nameFromObj) {
                        setOrganizerName(nameFromObj);
                        return;
                    }
                }
                if (event.organizer && typeof event.organizer === 'string') {
                    const res = await api.get(`/auth/profile/${event.organizer}`);
                    const user = res.data?.user || {};
                    setOrganizerName(user.name || user.username || '');
                }
            } catch (e) {
                // ignore
            }
        };
        resolveOrganizer();
    }, [event]);

    if (loading) return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <Navbar />
            <p className="text-center text-lg mt-20">Loading event...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <Navbar />
            <p className="text-center text-red-500 text-lg mt-20 px-4">{error}</p>
        </div>
    );

    if (!event) return null;

    const eventDate = new Date(event.date);

    return (
        <>
            <Navbar />
            <div className="bg-[#25334a] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl bg-[#30405a] rounded-xl shadow-md overflow-hidden">
                    {event.image && (
                        <img src={`https://growathlete.onrender.com${event.image}`} alt={event.title} className="w-100 h-100 mx-auto
                         object-cover" />
                    )}
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray" style={{color :"gray"}}>{event.title}</h1>
                            <Link 
                                to="/events" 
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-black  bg-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                &larr; Back to Events
                            </Link>
                        </div>
                        <div className="flex items-center text-white mb-4 space-x-6">
                            <span className="flex items-center"><FaCalendarAlt className="mr-2 text-white" /> {eventDate.toLocaleDateString()}</span>
                            <span className="flex items-center"><FaMapMarkerAlt className="mr-2 text-white" /> {event.location}</span>
                        </div>
                        {(organizerName || event.organizer) && (
                            <p className="text-sm text-white mb-2">Organized by {organizerName || event.organizer}</p>
                        )}
                        <p className="text-white leading-relaxed text-base sm:text-lg whitespace-pre-line">{event.description}</p>

                        <p className="text-white leading-relaxed text-base sm:text-lg whitespace-pre-line">{event.sport} | {event.category}</p>

                        <h3 className="text-white leading-relaxed text-base sm:text-lg whitespace-pre-line">{event.currency}{event.price}</h3>
                        {event.registrationLink && (
                            <a href={event.registrationLink} target="_blank" rel="noreferrer" className="inline-block mt-6 px-5 py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium">Register Now</a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetailPage;


