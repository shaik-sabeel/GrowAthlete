// import React from 'react';
// import { Link } from 'react-router-dom'; // Make sure Link is imported for button/link in content
// import { motion } from 'framer-motion'; // Make sure motion is imported

// import {
//   FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserFriends, FaPhoneAlt,
//   FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaHeart
// } from 'react-icons/fa'; // All react-icons must be installed: npm install react-icons

// // Import the stylesheet directly as per your structure
// import './Footer.css'; // <-- Footer.css at src/components/Footer.css

// const Footer = () => {
//   return (
//     <motion.footer className="footer"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.5 }}>
//       <div className="footer-container">

//         {/* Main grid for footer content */}
//         <div className="footer-grid">

//           {/* About Us Section */}
//           <div className="footer-section">
//             <h3>About Us</h3>
//             <p>Empowering young sports talents across India by providing a platform for discovery, promotion, and development. Join our community of athletes, coaches, and sponsors.</p>
//             <div className="sport-tags">
//               {['Football', 'Cricket', 'Basketball', 'Athletics'].map((sport) => (
//                 <span key={sport} className="sport-tag">{sport}</span>
//               ))}
//             </div>
//           </div>

//           {/* Quick Links Section */}
//           <div className="footer-section">
//             <h3>Quick Links</h3>
//             <ul className="footer-links">
//               <li><Link to="/" className="footer-link"><FaHome /><span>Home</span></Link></li>
//               <li><Link to="/about" className="footer-link"><FaInfoCircle /><span>About Us</span></Link></li>
//               <li><Link to="/contact" className="footer-link"><FaEnvelope /><span>Contact</span></Link></li>
//               <li><Link to="/login" className="footer-link"><FaSignInAlt /><span>Sign In</span></Link></li>
//               <li><Link to="/athletes" className="footer-link"><FaUserFriends /><span>Athletes</span></Link></li>
//             </ul>
//           </div>

//           {/* Connect With Us Section */}
//           <div className="footer-section">
//             <h3>Connect With Us</h3>
//             <ul className="footer-links">
//               <li><a href="mailto:growathlete.info@gmail.com" className="footer-link"><FaEnvelope /><span>growathlete.info@gmail.com</span></a></li>
//               <li><a href="tel:+918500767368" className="footer-link"><FaPhoneAlt /><span>+91 8500767368</span></a></li>
//             </ul>
//             <div className="socials-container">
//               <h4>Follow Us</h4>
//               <div className="socials-list">
//                 <a href="#" className="social-icon facebook"><FaFacebookF /></a>
//                 <a href="#" className="social-icon instagram"><FaInstagram /></a>
//                 <a href="#" className="social-icon twitter"><FaTwitter /></a>
//                 <a href="#" className="social-icon youtube"><FaYoutube /></a>
//               </div>
//             </div>
//           </div>

//           {/* Brand Section */}
//           <div className="footer-section brand-section">
//             <h2 className="brand-title">Grow<span>Athlete</span> India</h2>
//             <div className="brand-underline"></div>
//             {/* <p className="brand-designed-by">
//               Designed with <FaHeart className="heart-icon" /> for young athletes
//             </p> */}
//           </div>

//         </div>

//         {/* Bottom Bar: Copyright & Legal Links */}
//         <div className="footer-bottom">
//           <p>&copy; 2025 GrowAthlete India. All rights reserved.</p>
//           <div className="footer-bottom-links">
//             <a href="#">Privacy Policy</a>
//             <a href="#">Terms of Service</a>
//             <a href="#">Cookies</a>
//           </div>
//         </div>

//       </div>
//     </motion.footer>
//   );
// };

// export default Footer;

// frontend/src/components/Footer.jsx

// frontend/src/components/Footer.jsx

import React from 'react';
import './Footer.css';
import { FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-column">
          <h4>GrowAthlete</h4>
          <p>
            Empowering young sports talents across India by providing a platform for discovery, promotion, and development.
          </p>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/athletes">Athletes</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/login">Sign In</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact Us</h4>
          <div className="footer-contact-info">
            <p><FaEnvelope /> growathlete.info@gmail.com</p>
            <p><FaPhone /> +91 8500767368</p>
          </div>
          <h4>Follow Us</h4>
          <div className="footer-social-icons">
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaFacebook /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Sports</h4>
          <ul className="footer-links">
            <li><a href="/sports/football">Football</a></li>
            <li><a href="/sports/cricket">Cricket</a></li>
            <li><a href="/sports/basketball">Basketball</a></li>
          </ul>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GrowAthlete India. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;