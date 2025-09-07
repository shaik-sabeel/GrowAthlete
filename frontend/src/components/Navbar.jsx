// src/components/Navbar.jsx (Your global header component)
import React, { useState,useEffect } from 'react';
import api from '../utils/api';
import { useNavigate,Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


// --- Important: We assume you have a src/components/Button.jsx file for your <Button> component
// If not, these won't work and you'd have to use simple <button> or <a> tags with App.css classes.
import Button from './Button'; // Assuming src/components/Button.jsx


import './Navbar.css'; // Global CSS for the Navbar, as per your structure
// import ThemeChange from './ThemeChange';


// Import the logo image
import gaLogo from '../assets/galogo.png';


const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Athletes', path: '/athletes' },
  { name: 'News', path: '/news' }, // Sports News from SportsPulse
  // { name: 'Live Scores', path: '/live-scores' }, // Separated Live Scores
  { name: 'My Profile', path: '/profile' },
  { name: 'Sports Resume', path: '/sports-resume' },
  { name: 'Community', path: '/community' },
  ,

  { name: 'More', subLinks: [
    { name: 'Events', path: '/events' },
    { name: 'Sponsorships', path: '/sponsorships' },
    // { name: 'Resources', path: '/resources' },
    { name: 'Membership', path: '/membership' },
    { name: 'Contact Us', path: '/contact' }
   
  ]},
];

const mobileMenuVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.15,
      duration: 0.6
    }
  },
  exit: {
    x: "100%",
    transition: {
      ease: "easeOut",
      duration: 0.3
    }
  }
};

const Navbar = () => {

const navigate = useNavigate();
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [data, setData] = useState(null);

  // useEffect(() => {
  //   // Whenever isAuthenticated changes, notify parent
  //   sendAuthState(isAuthenticated);
  // }, [isAuthenticated, sendAuthState]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await api.get("/auth/profile");
  //       setData(res.data.user);
  //       setIsAuthenticated(true); // Set authenticated state based on profile data
  //     } catch (err) {
  //       setIsAuthenticated(false); // If fetching fails, user is not authenticated
  //       console.error("Error fetching profile data:", err);
  //     }
  //   };
  //   fetchData();
  // }, [isAuthenticated]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;  // 🚀 Don't call API if no token

      const res = await api.get("/auth/profile");
      setData(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
      setData(null);
      console.error("Error fetching profile data:", err);
    }
  };
  fetchData();
}, []); // run once on mount


//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const res = await api.get("/auth/profile");
//       setData(res.data.user);
//       setIsAuthenticated(true);
//     } catch (err) {
//       setIsAuthenticated(false);
//       setData(null);
//     }
//   };
//   fetchData();
// }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      setData(null); // Clear user data on logout
      setIsAuthenticated(false); // Update authentication state
      alert("Logged out successfully!");
      // Redirect to home page after logout
      navigate('/') // Redirect to home after logout
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed");
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar ">
      <div className="navbar-logo">
        <Link to="/" onClick={closeMobileMenu}>
          <img src={gaLogo} alt="GrowAthlete Logo" className="navbar-logo-icon" />
          GrowAthlete India
        </Link>
      </div>

      {/* Hamburger menu for mobile, controlled by class states */}
      <div className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
        <div className="hamburger-bar"></div>
        <div className="hamburger-bar"></div>
        <div className="hamburger-bar"></div>
      </div>

      {/* Mobile Navigation Links - animated with Framer Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={`navbar-links mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map((link, index) => (
              link.subLinks ? (
                <div className="dropdown" key={index}>
                  <a href="#" className="dropdown-toggle" onClick={(e) => e.preventDefault()}>
                    {link.name} <span style={{fontSize: '0.6em'}}>&#9660;</span>
                  </a>
                  <div className="dropdown-menu">
                    {link.subLinks.map((subLink) => (
                      <NavLink key={subLink.name} to={subLink.path} onClick={closeMobileMenu}>
                        {subLink.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={link.name} to={link.path} onClick={closeMobileMenu}>
                  {link.name}
                </NavLink>
              )
            ))}
            <div className="navbar-auth mobile-only">
                {/* Use the common Button component with specific variant */}
                {/* <Button variant="header-signin" link="/login">Sign In</Button> */}
                {isAuthenticated ? (<Button onClick={handleLogout} variant="header-signin">Log out</Button>):(<Button variant="header-signin" link="/login">Sign In</Button>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation Links */}
      <div className="navbar-links desktop-nav">
        {navLinks.map((link, index) => (
              link.subLinks ? (
                <div className="dropdown" key={index}>
                  <a href="#" className="dropdown-toggle" onClick={(e) => e.preventDefault()}>
                    {link.name} <span style={{fontSize: '0.6em'}}>&#9660;</span>
                  </a>
                  <div className="dropdown-menu">
                    {link.subLinks.map((subLink) => (
                      <NavLink key={subLink.name} to={subLink.path}>
                        {subLink.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={link.name} to={link.path}>
                  {link.name}
                </NavLink>
              )
            ))}
      </div>
            {/* <ThemeChange /> */}

      {/* Desktop Auth Button */}
      <div className="navbar-auth desktop-only">
        {/* Use the common Button component with specific variant */}
        {isAuthenticated ? (<Button onClick={handleLogout} variant="header-signin">Log out</Button>):(<Button variant="header-signin" link="/login">Sign In</Button>)}

      </div>
    </nav>
  );
};

export default Navbar;