import React, { useState, useEffect } from 'react';
import api from '../utils/api';
// import Navbar from '../components/Navbar'; // Navbar is already in App.jsx layout
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaMedal } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ATHLETE_CARDS_DATA } from '../utils/constants';
import athlete from '../assets/images/athletes-bg.mp4';

const AthletesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/all-users');
        // Filter out non-athlete users if necessary, assuming all-users returns everyone
        const athletes = res.data.filter(user => user.role === 'athlete' || !user.role);
        setData(athletes);
        setFilteredAthletes(athletes.slice(0, 6));
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔎 Filtering logic (by username, sport, location)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAthletes(data.slice(0, 6));
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const results = data.filter(
        (athlete) =>
          athlete?.username?.toLowerCase().includes(lowerTerm) ||
          athlete?.sport?.toLowerCase().includes(lowerTerm) ||
          athlete?.location?.toLowerCase().includes(lowerTerm)
      );
      setFilteredAthletes(results);
    }
  }, [searchTerm, data]);

  const navigate = useNavigate();

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 md:pb-12 relative z-10">

        {/* SIDEBAR: Search & Filters */}
        <aside className="col-span-12 lg:col-span-3 space-y-6 lg:sticky lg:top-24 h-fit">

          <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaFilter className="text-orange-500" /> Filters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Name, Sport, City..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Add more filters here later (e.g., Sport dropdown, Location dropdown) */}

              <div className="pt-2">
                <button
                  onClick={() => setSearchTerm('')}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Ad Widget (Reused functionality/style) */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-6 border border-indigo-700/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            <div className="relative z-10">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-3 inline-block">Pro</span>
              <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Join the Elite</h3>
              <p className="text-indigo-200 text-sm mb-4">Connect with top coaches and scouts.</p>
              <Link to="/membership">
                <button className="w-full py-2.5 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                  Get Scouted
                </button>
              </Link>
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="col-span-12 lg:col-span-9 space-y-8">

          {/* Hero Section (Condensed) */}
          <section className="relative rounded-3xl overflow-hidden h-64 shadow-2xl border border-gray-700/50 group">
            <video className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" autoPlay loop muted playsInline>
              <source src={athlete} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-12">
              <motion.h1
                variants={heroVariants} initial="hidden" animate="visible"
                className="text-3xl lg:text-5xl font-extrabold text-black bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-2" style={{ color: "white" }}
              >
                Featured Athletes
              </motion.h1>
              <motion.p
                variants={heroVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
                className="text-gray-300 max-w-xl text-lg"
              >
                Discover the rising stars of Indian sports making waves with their talent.
              </motion.p>
            </div>
          </section>

          {/* Athletes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              // Loading Skeletons
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-2xl h-80 animate-pulse border border-gray-700"></div>
              ))
            ) : filteredAthletes.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
                <p className="text-gray-400 text-lg">No athletes found matching "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-orange-500 hover:underline">Clear Search</button>
              </div>
            ) : (
              filteredAthletes.map((athlete, index) => (
                <motion.div
                  key={athlete._id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 hover:border-orange-500/50 hover:shadow-orange-500/10 transition-all duration-300 group flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-700">
                    <img
                      src={athlete.profilePicture || `https://ui-avatars.com/api/?name=${athlete.username}&background=random&color=fff&size=200`}
                      alt={athlete.username}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white truncate">{athlete.username}</h3>
                      <p className="text-orange-400 text-sm font-medium uppercase tracking-wide">{athlete.sport || 'Athlete'}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      {athlete.location && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <FaMapMarkerAlt className="mr-2 text-gray-500" />
                          {athlete.location}
                        </div>
                      )}
                      {/* Placeholder for achievements if available in data */}
                      {/* <div className="flex items-center text-gray-400 text-sm">
                          <FaMedal className="mr-2 text-yellow-500" />
                          <span>State Champion</span>
                        </div> */}
                    </div>

                    <Link
                      to={`/athletes/${athlete._id}`}
                      className="w-full py-2.5 flex items-center justify-center rounded-xl bg-gray-700 text-white font-semibold hover:bg-orange-600 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Discover More Section */}
          <section className="pt-8 border-t border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">More to Explore</h3>
              {/* <Link to="/athletes-full-directory" className="text-orange-500 hover:text-orange-400 text-sm font-semibold">View Directory &rarr;</Link> */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ATHLETE_CARDS_DATA.slice(0, 4).map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-xl p-3 border border-gray-700 hover:bg-gray-750 transition-colors text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 overflow-hidden mb-3">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.sport}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default AthletesPage;
