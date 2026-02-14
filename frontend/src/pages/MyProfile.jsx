import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FaUserEdit, FaRunning, FaDumbbell, FaBolt, FaBrain, FaMedal, FaMapMarkerAlt, FaEnvelope, FaPhone, FaCalendarAlt, FaQrcode, FaTimes, FaSave, FaBan } from "react-icons/fa";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showQR, setShowQR] = useState(false);

  // Fake data generators for visual flair (in real app, these might come from DB)
  const [activityStreak, setActivityStreak] = useState(0);
  const [performanceDNA, setPerformanceDNA] = useState({ speed: 50, endurance: 50, agility: 50, strength: 50, skill: 50 });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (id) {
          res = await api.get(`/auth/profile/${id}`);
        } else {
          res = await api.get("/auth/profile");
        }
        setUser(res.data.user);

        // Initialize mock data based on user constraints if possible, or random for demo
        setActivityStreak(res.data.user.streak || 0);
        setPerformanceDNA({
          speed: Math.floor(Math.random() * 30) + 70,
          endurance: Math.floor(Math.random() * 30) + 70,
          agility: Math.floor(Math.random() * 30) + 70,
          strength: Math.floor(Math.random() * 30) + 70,
          skill: Math.floor(Math.random() * 30) + 70,
        });

      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Could not load profile. Please try again later.");
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleEditClick = () => {
    setEditData({
      username: user.username || "",
      age: user.age || "",
      location: user.location || "",
      bio: user.bio || "",
      phone: user.phone || "",
      // Add other fields as necessary
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditData({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      // Note: Backend might require specific fields. 
      // We are only sending what we edit here.
      const res = await api.post("/auth/update", editData);
      setUser(res.data.user);
      setIsEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 pt-24 flex flex-col items-center justify-center text-white">
          <p className="text-xl text-red-500">{error || "User not found"}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">Go Home</button>
        </div>
      </>
    );
  }

  const isOwnProfile = !id || (user._id === id); // Simplified logic, backend auth handles real security

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      {/* Main Content Container - Added pt-24 to clear fixed navbar */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <div className="relative bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-8 border border-gray-700">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-orange-900/40 opacity-50"></div>

          <div className="relative z-10 px-4 py-8 sm:px-8 sm:py-16 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Profile Image with Ring */}
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <img
                src={user.profilePicture || "https://via.placeholder.com/150"}
                alt={user.username}
                className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-gray-900 shadow-xl"
              />
              <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-2 border border-gray-700">
                <span className="text-xl">🏆</span>
              </div>
            </div>

            {/* Identity & Stats */}
            <div className="text-center md:text-left flex-1 w-full">
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 sm:gap-3 mb-2">
                {isEditMode ? (
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="bg-gray-700 text-2xl font-bold rounded px-3 py-1 text-white border border-gray-600 focus:border-orange-500 outline-none w-full sm:w-auto text-center sm:text-left"
                  />
                ) : (
                  <h1 className="text-3xl sm:text-4xl font-extrabold !text-white tracking-wide drop-shadow-md" style={{ color: "white" }}>
                    {user.username}
                  </h1>
                )}
                <div className="flex gap-2 mt-1 sm:mt-0">
                  <span className="px-3 py-1 bg-orange-600/90 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {user.sport || "Athlete"}
                  </span>
                  <span className="px-3 py-1 bg-blue-600/90 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {user.level || "Rookie"}
                  </span>
                </div>
              </div>

              <p className="!text-gray-200 mb-6 max-w-2xl mx-auto md:mx-0 text-sm sm:text-base leading-relaxed px-2 sm:px-0" style={{ color: "#e5e7eb" }}>
                {isEditMode ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full bg-gray-700 rounded p-2 text-white border border-gray-600 focus:border-orange-500 outline-none"
                    rows="3"
                  />
                ) : (
                  user.bio || "No bio available. Keep pushing limits!"
                )}
              </p>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowQR(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all shadow-lg hover:shadow-orange-500/20 border border-gray-600 group"
                >
                  <FaQrcode className="text-orange-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Smart Card</span>
                </button>

                {/* Only show Edit button if it's the user's own profile (or handle via permission logic) */}
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all shadow-lg shadow-orange-600/30 font-semibold"
                >
                  <FaUserEdit /> Edit Profile
                </button>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="hidden lg:flex flex-col items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <span className="text-3xl">🔥</span>
              <span className="text-2xl font-bold text-white mt-1">{activityStreak}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest">Day Streak</span>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - Personal Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaUserEdit className="text-blue-500" /> Personal Details
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Age</span>
                  <span className="text-white font-medium">{user.age || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Gender</span>
                  <span className="text-white font-medium capitalize">{user.gender || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Location</span>
                  <span className="text-white font-medium text-right">{user.location || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white font-medium text-sm">{user.email || "Hidden"}</span>
                </div>
              </div>
            </div>

            {/* CONTACT CARD */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaPhone className="text-green-500" /> Contact
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span>{user.location || "Earth"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Performance & Achievements */}
          <div className="lg:col-span-2 space-y-8">

            {/* Performance DNA */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaBolt className="text-yellow-500" /> Performance DNA
                </h2>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Estimated</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {Object.entries(performanceDNA).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center p-3 bg-gray-900/50 rounded-xl border border-gray-700">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-700" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                          className={`text-orange-500 transition-all duration-1000 ease-out`}
                          strokeDasharray={175}
                          strokeDashoffset={175 - (175 * value) / 100}
                        />
                      </svg>
                      <span className="absolute text-sm font-bold text-white">{value}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaMedal className="text-yellow-400" /> Key Achievements
              </h2>

              {user.achievements ? (
                <div className="space-y-4">
                  {/* Assuming achievements is a text block, let's split by newline or display as proper paragraph */}
                  <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 text-gray-300 leading-relaxed whitespace-pre-line">
                    {user.achievements}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 italic">
                  No achievements listed yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* QR MODAL */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl animate-fade-in-up">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
            >
              <FaTimes size={24} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.username}</h3>
            <p className="text-orange-600 font-semibold uppercase text-sm tracking-widest mb-6">GrowAthlete Profile</p>

            <div className="flex justify-center mb-6">
              <QRCodeSVG value={`${window.location.origin}/profile/${user._id}`} size={200} />
            </div>

            <p className="text-gray-500 text-sm">Scan to view full athletic profile</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyProfile;
