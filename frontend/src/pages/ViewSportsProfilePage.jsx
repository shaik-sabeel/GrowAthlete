// frontend/src/pages/ViewSportsProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSportsProfileById, sendConnectionRequest, acceptConnectionRequest, declineConnectionRequest, disconnectUser, getMySportsProfile } from '../utils/api';
// Removed: import './pages_css/ViewSportsProfilePage.css'; // No longer needed

const ViewSportsProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [myProfile, setMyProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const [profileRes, myProfileRes] = await Promise.all([
                getSportsProfileById(userId),
                getMySportsProfile()
            ]);
            setProfile(profileRes.data);
            setMyProfile(myProfileRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'Failed to load profile.');
            setLoading(false);
            setProfile(null);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [userId]);

    const handleConnectionAction = async (actionType) => {
        setMessage('');
        setError('');
        try {
            let res;
            if (actionType === 'connect') {
                res = await sendConnectionRequest(userId);
            } else if (actionType === 'accept') {
                res = await acceptConnectionRequest(userId);
            } else if (actionType === 'decline') {
                res = await declineConnectionRequest(userId);
            } else if (actionType === 'disconnect') {
                res = await disconnectUser(userId);
            }
            setMessage(res.data.message);
            // Re-fetch profiles to update connection status
            setTimeout(fetchProfiles, 1000); // Small delay to ensure backend update
        } catch (err) {
            console.error(`Connection action (${actionType}) failed:`, err.response?.data || err.message);
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-600 text-lg">Loading profile...</div>;
    if (error) return <div className="text-center py-12 text-red-600 text-lg">{error}</div>;
    if (!profile) return <div className="text-center py-12 text-gray-500 text-lg">Profile not found or still loading.</div>;

    // Determine connection status relative to the current user
    const isCurrentUser = myProfile && myProfile.userId._id === profile.userId._id;
    const isConnected = myProfile?.connections?.some(conn => conn._id === profile.userId._id);
    const hasSentRequest = myProfile?.pendingSentConnections?.some(req => req._id === profile.userId._id);
    const hasReceivedRequest = myProfile?.pendingReceivedConnections?.some(req => req._id === profile.userId._id);

    return (
        <div className="max-w-5xl mx-auto my-10 p-8 bg-white rounded-lg shadow-xl font-sans text-gray-800">
            {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">{message}</p>}
            {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">{error}</p>}
            
            <div className="flex flex-col md:flex-row items-center md:items-start pb-8 mb-8 border-b border-gray-200">
                {profile.profilePicture && (
                    <img
                        src={`http://localhost:5000/${profile.profilePicture}`}
                        alt="Profile"
                        className="w-48 h-48 rounded-full object-cover mr-0 md:mr-10 mb-6 md:mb-0 border-4 border-blue-500 shadow-lg"
                    />
                )}
                <div className="flex-grow text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{profile.userId.username}'s Sports Profile</h1>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">{profile.bio}</p>
                    
                    {!isCurrentUser && (
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            {isConnected ? (
                                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300" onClick={() => handleConnectionAction('disconnect')}>Disconnect</button>
                            ) : hasSentRequest ? (
                                <button className="bg-yellow-400 text-gray-800 font-semibold py-2 px-6 rounded-full shadow-md cursor-not-allowed" disabled>Request Sent</button>
                            ) : hasReceivedRequest ? (
                                <>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300" onClick={() => handleConnectionAction('accept')}>Accept Connection</button>
                                    <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300" onClick={() => handleConnectionAction('decline')}>Decline</button>
                                </>
                            ) : (
                                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300" onClick={() => handleConnectionAction('connect')}>Connect</button>
                            )}
                        </div>
                    )}
                     {isCurrentUser && (
                        <Link to="/create-profile" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 mt-4">Edit My Profile</Link>
                    )}
                </div>
            </div>

            <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 pb-2 border-blue-100">Sports & Specialization</h2>
                {profile.sports.length > 0 ? (
                    <ul className="list-disc list-inside text-lg">
                        {profile.sports.map((sport, index) => (
                            <li key={index} className="mb-2">
                                <strong className="text-blue-700">{sport.name}</strong>
                                {sport.specialization && ` - ${sport.specialization}`}
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500">No sports listed yet.</p>}
            </section>

            <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 pb-2 border-blue-100">Experience</h2>
                {profile.experience.length > 0 ? (
                    profile.experience.map((exp, index) => (
                        <div key={index} className="mb-6 pb-6 border-b border-gray-100 last:border-b-0">
                            <h3 className="text-xl font-semibold text-gray-800">{exp.teamClub} <span className="text-sm text-gray-500 ml-2">({exp.yearsPlayed})</span></h3>
                            {exp.description && <p className="text-gray-600 mt-2 mb-4">{exp.description}</p>}
                            
                            {exp.tournaments && exp.tournaments.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">Tournaments:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {exp.tournaments.map((t, i) => <li key={i} className="mb-1">{t}</li>)}
                                    </ul>
                                </div>
                            )}
                            {exp.achievements && exp.achievements.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">Achievements:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {exp.achievements.map((a, i) => <li key={i} className="mb-1">{a}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                ) : <p className="text-gray-500">No experience listed yet.</p>}
            </section>

            <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 pb-2 border-blue-100">Skills & Attributes</h2>
                {profile.skillsAttributes.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {profile.skillsAttributes.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : <p className="text-gray-500">No skills or attributes listed yet.</p>}
            </section>

            <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 pb-2 border-blue-100">Connections ({profile.connections.length})</h2>
                {profile.connections.length > 0 ? (
                    <ul className="space-y-2">
                        {profile.connections.map(conn => (
                            <li key={conn._id}>
                                <Link to={`/profile/${conn._id}`} className="text-blue-600 hover:text-blue-800 font-semibold text-lg hover:underline transition duration-200">
                                    {conn.username}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500">No connections yet.</p>}
            </section>

            {isCurrentUser && myProfile.pendingReceivedConnections && myProfile.pendingReceivedConnections.length > 0 && (
                <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 pb-2 border-blue-100">Pending Requests ({myProfile.pendingReceivedConnections.length})</h2>
                    <ul className="space-y-3">
                        {myProfile.pendingReceivedConnections.map(sender => (
                            <li key={sender._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
                                <Link to={`/profile/${sender._id}`} className="text-blue-600 hover:text-blue-800 font-semibold text-lg hover:underline transition duration-200">
                                    {sender.username}
                                </Link>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleConnectionAction('accept', sender._id)}
                                        className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded-md transition duration-200"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleConnectionAction('decline', sender._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition duration-200"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

        </div>
    );
};

export default ViewSportsProfilePage;