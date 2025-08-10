import React from 'react';
// import './Footer.css'; 
import { 
  FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserFriends, FaPhoneAlt, 
  FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaHeart 
} from 'react-icons/fa';

// Import the stylesheet
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Main grid for footer content */}
        <div className="footer-grid">
          
          {/* About Us Section */}
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Empowering young sports talents across India by providing a platform for discovery, promotion, and development. Join our community of athletes, coaches, and sponsors.</p>
            <div className="sport-tags">
              {['Football', 'Cricket', 'Basketball', 'Athletics'].map((sport) => (
                <span key={sport} className="sport-tag">{sport}</span>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link"><FaHome /><span>Home</span></a></li>
              <li><a href="#" className="footer-link"><FaInfoCircle /><span>About Us</span></a></li>
              <li><a href="#" className="footer-link"><FaEnvelope /><span>Contact</span></a></li>
              <li><a href="#" className="footer-link"><FaSignInAlt /><span>Sign In</span></a></li>
              <li><a href="#" className="footer-link"><FaUserFriends /><span>Athletes</span></a></li>
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <ul className="footer-links">
              <li><a href="mailto:growathlete.info@gmail.com" className="footer-link"><FaEnvelope /><span>growathlete.info@gmail.com</span></a></li>
              <li><a href="tel:+918500767368" className="footer-link"><FaPhoneAlt /><span>+91 8500767368</span></a></li>
            </ul>
            <div className="socials-container">
              <h4>Follow Us</h4>
              <div className="socials-list">
                <a href="#" className="social-icon facebook"><FaFacebookF /></a>
                <a href="#" className="social-icon instagram"><FaInstagram /></a>
                <a href="#" className="social-icon twitter"><FaTwitter /></a>
                <a href="#" className="social-icon youtube"><FaYoutube /></a>
              </div>
            </div>
          </div>

          {/* Brand Section */}
          <div className="footer-section brand-section">
            <h2 className="brand-title">Grow<span>Athlete</span> India</h2>
            <div className="brand-underline"></div>
            <p className="brand-designed-by">
              Designed with <FaHeart className="heart-icon" /> for young athletes
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="footer-bottom">
          <p>&copy; 2025 GrowAthlete India. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;