// src/pages/AthletesPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar'; // Assuming you have a Navbar component
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaSearch, FaAngleDown, FaSyncAlt } from 'react-icons/fa'; // Icons for search/filters
import { Link } from 'react-router-dom';
import { ATHLETE_CARDS_DATA } from '../utils/constants'; // Your dummy athlete data
import athlete from '../assets/athletes-bg.mp4';
import soham from '../assets/soham.jpg'; // Example athlete image, replace with actual data

// Assuming you have a reusable Button component here:
import Button from '../components/Button'; // Assuming src/components/Button.jsx

// Assuming SectionHeader is handled by the common classes h2.section-heading in App.css for consistent titles
const SectionHeader = ({ title, description }) => (
    <div className="section-header-common"> {/* Apply global utility classes here for section alignment/margin */}
        <h2 className="section-heading">{title}</h2>
        {description && <p className="section-description">{description}</p>}
    </div>
);


import '../pages_css/AthletesPage.css'; // Page-specific styles for AthletesPage
// import '../pages_css/variables.css'; // Already imported by App.css


const AthletesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAthletes, setFilteredAthletes] = useState([]); // Or integrate API call here
  const [data, setData] = useState([]);

  const { ref: filterRef, inView: filterInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: discoverRef, inView: discoverInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/auth/all-users");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        alert("Failed to fetch athletes data", err);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const results = ATHLETE_CARDS_DATA.filter(athlete =>
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.sport.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAthletes(results);
  }, [searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm('');
  };

  const heroTitleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const athleteCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <>
    <Navbar/>
      {/* Featured Athletes Hero Section with Video */}
      <section className="ap-hero-section">
        <video className="ap-hero-video-bg" autoPlay loop muted playsInline>
          <source src={athlete} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="ap-video-overlay"></div>
        <div className="ap-hero-content">
          <motion.h1
            variants={heroTitleVariants}
            initial="hidden"
            animate="visible"
          >
            Featured Athletes
          </motion.h1>
          <motion.p
            variants={heroTitleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, ...heroTitleVariants.visible.transition }}
          >
            Discover the rising stars of Indian sports who are making waves <br/> with their exceptional talent and dedication.
          </motion.p>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="ap-filter-section" ref={filterRef}>
        <div className="ap-filter-container container">
          <div className="ap-filter-input-group">
            <input
              type="text"
              placeholder="Filter Athletes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ap-filter-input"
            />
          </div>

          <div className="ap-filter-actions">
            <button className="ap-show-filters-button">
              Show Filters <FaAngleDown />
            </button>
            <Button variant="primary" onClick={() => {/* Perform actual search logic */}}>
              <FaSearch /> Search
            </Button>
            <button className="ap-reset-filters-button" onClick={handleResetFilters}>
              <FaSyncAlt /> Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* Display Filtered Athletes (or "No athletes found") */}
      <section className="ap-filtered-results-section container">
        {filteredAthletes.length === 0 && (
          <motion.p
            className="ap-no-results-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            No athletes found matching your criteria.
          </motion.p>
        )}

        {/* {filteredAthletes.length > 0 && (
          <div className="ap-athlete-grid">
            {filteredAthletes.map((athlete, index) => (
              <motion.div
                key={athlete.id}
                className="ap-athlete-card"
                variants={athleteCardVariants}
                initial="hidden"
                animate={filterInView ? "visible" : "hidden"} // Animate when filter section is in view
                transition={{ delay: index * 0.1, ...athleteCardVariants.visible.transition }}
                whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              >
                <img src={athlete.imageUrl} alt={athlete.name} className="ap-athlete-image" />
                <div className="ap-athlete-info">
                  <h3>{athlete.name}</h3>
                  <p>{athlete.sport}</p>
                  <small>{athlete.achievements}</small>
                  <Button variant="link" link={`/athletes/${athlete.id}`}>View Profile &rarr;</Button>
                </div>
              </motion.div>
            ))}
          </div>
        )} */}


        {data.length > 0 && (
          <div className="ap-athlete-grid">
            {data && data.map((athlete, index) => (
              <motion.div
                key={athlete._id}
                className="ap-athlete-card"
                variants={athleteCardVariants}
                initial="hidden"
                animate={filterInView ? "visible" : "hidden"} // Animate when filter section is in view
                transition={{ delay: index * 0.1, ...athleteCardVariants.visible.transition }}
                whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              >
                <img src={athlete.profilePicture} alt={athlete.username} className="ap-athlete-image" />
                <div className="ap-athlete-info">
                  <h3>{athlete.username}</h3>
                  <p>{athlete.sport}</p>
                  <small>{athlete.bio}</small>
                  <small>{athlete.location}</small>
                  <small>{athlete.age}</small>
                  <small>{athlete.achievements}</small>
                  <Button variant="link" link={`/athletes/${athlete.id}`}>View Profile &rarr;</Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}


      </section>


      {/* Discover More Athletes Section (always shown below filter) */}
      <section className="ap-discover-more-section container" ref={discoverRef}>
        <SectionHeader
          title="Discover More Athletes"
          description="Explore thousands of athletic profiles across different sports, age groups, and regions."
        />
        <div className="ap-discover-grid-placeholder">
            {/* Displaying first 4 from all ATHLETE_CARDS_DATA just as placeholder for "More Athletes" */}
            {ATHLETE_CARDS_DATA.slice(0, 4).map((athlete, index) => (
              <motion.div
                key={`discover-${athlete.id}`}
                className="ap-athlete-card" // Reuse existing athlete card style
                variants={athleteCardVariants}
                initial="hidden"
                animate={discoverInView ? "visible" : "hidden"}
                transition={{ delay: index * 0.1 + 0.5, ...athleteCardVariants.visible.transition }} // Delay to ensure previous content loads first
                whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              >
                <img src={athlete.imageUrl} alt={athlete.name} className="ap-athlete-image" />
                <div className="ap-athlete-info">
                  <h3>{athlete.name}</h3>
                  <p>{athlete.sport}</p>
                  <small>{athlete.achievements}</small>
                  <Button variant="link" link={`/athletes/${athlete.id}`}>View Profile &rarr;</Button>
                </div>
              </motion.div>
            ))}
        </div>
        <div className="ap-discover-more-button-container">
          <Button variant="primary" link="/athletes-full-directory">View Full Directory &rarr;</Button>
        </div>
      </section>
    </>
  );
};

export default AthletesPage;