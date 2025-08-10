import React from 'react';
import background from '../assets/background.mp4';
import cricket from '../assets/cricket.png';
import football from '../assets/football.png';
import basketball from '../assets/basketball.png';
import swimming from '../assets/swimming.png';


import '../pages_css/AboutPage.css'; // Correct path to the CSS file
import Footer from '../components/Footer'; // Import the new Footer

import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa';
import { GiBullseye, GiPodium, GiTeamIdea } from 'react-icons/gi';

const AboutPage = () => {
  // A small helper to handle potential local images in the future
  // For now, it uses web URLs. You can change this to use images from your 'assets' folder.
  // Example: const getImageUrl = (name) => `/src/assets/images/${name}`;

  const sports = [
    { name: 'Cricket', imgUrl: cricket },
    { name: 'Football', imgUrl: football},
    { name: 'Basketball', imgUrl: basketball},
    { name: 'Swimming', imgUrl: swimming },
  ];

  return (
    <div className="about-container">
      {/* Header Navigation */}
      {/* <header className="about-header">
        <div className="logo">GrowAthlete <span>India</span></div>
        <nav className="about-nav">
          <a href="#">Home</a>
          <a href="#" className="active">About</a>
          <a href="#">Athletes</a>
          <a href="#">News</a>
          <a href="#">Community</a>
        </nav>
        <button className="sign-in-btn">Sign In</button>
      </header> */}
            {/* Replace with your desired video URL */}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-video-container">
          {/* <img src="" alt="" /> */}
          <video autoPlay loop muted playsInline className="hero-video">
            <source src={background} type="video/mp4" />

            Your browser does not support the video tag.
          </video>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1>About Us</h1>
          {/* <p>Empowering the next generation of sports talent across India.</p> */}
          <p>GrowAthlete is a sports community and athlete discovery platform designed to help athletes of all levels showcase their talent, connect with coaches, scouts, and sponsors, and access valuable growth opportunities. Athletes can create detailed profiles with their performance stats, achievements, and media, join sports-specific communities, explore training resources, and participate in events such as tryouts and tournaments. By bridging the gap between aspiring talent and professional opportunities, GrowAthlete empowers athletes to take control of their careers and build a strong personal brand in the sports world.</p>
        </div>
      </section>

      {/* Info Cards Section (Mission, Vision, Story) */}
      <section className="info-cards-section">
        <div className="info-card">
          <GiBullseye className="info-icon" />
          <h2>Our Mission</h2>
          <p>To nurture and elevate young sports talents in India by providing them with the visibility, resources, and support necessary to achieve their dreams.</p>
        </div>
        <div className="info-card">
          <GiPodium className="info-icon" />
          <h2>Our Vision</h2>
          <p>To establish India as a global powerhouse of sports by enabling grassroots development and fostering a culture of excellence in athletics.</p>
        </div>
        <div className="info-card">
          <GiTeamIdea className="info-icon" />
          <h2>Our Story</h2>
          <p>Born from a recognition of immense but often unnoticed talent, our founders created a platform to bridge the gap for emerging sports stars.</p>
        </div>
      </section>

      {/* Featured Sports Section */}
      <section className="featured-sports-section">
        <h2>Featured Sports Categories</h2>
        <div className="sports-gallery">
          {sports.map(sport => (
            <div
              key={sport.name}
              className="sport-card"
              style={{ backgroundImage: `url(${sport.imgUrl})` }}
            >
              <h3>{sport.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
       <section className="core-values-section">
         <h2>Our Core Values</h2>
         <div className="values-grid">
           <div className="value-item"><h3>Excellence</h3><p>We strive for excellence in everything we do, from our platform's functionality to the quality of opportunities we provide.</p></div>
           <div className="value-item"><h3>Inclusivity</h3><p>We are committed to making sports opportunities accessible to talented individuals from all backgrounds and regions.</p></div>
           <div className="value-item"><h3>Integrity</h3><p>We operate with honesty, transparency, and fairness in all our interactions and decisions.</p></div>
           <div className="value-item"><h3>Innovation</h3><p>We continuously innovate to provide the best tools and resources for our athletes and partners.</p></div>
         </div>
       </section>

      {/* <Footer /> */}
          
      {/* Footer */}
      {/* <footer className="about-footer">
        <div className="footer-content">
            <div className="footer-col">
                <h3>About GrowAthlete</h3>
                <p>Empowering young sports talents across India by providing a platform for discovery, promotion, and development.</p>
            </div>
            <div className="footer-col">
                <h3>Quick Links</h3>
                <a href="#">Home</a>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Athletes</a>
            </div>
            <div className="footer-col">
                <h3>Connect With Us</h3>
                <p><FaEnvelope /> growathlete.info@email.com</p>
                <p><FaPhone /> +91 8500767388</p>
                <div className="social-icons">
                  <a href="#"><FaFacebookF /></a>
                  <a href="#"><FaTwitter /></a>
                  <a href="#"><FaInstagram /></a>
                  <a href="#"><FaYoutube /></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>© 2025 GrowAthlete India. All rights reserved.</p>
            <p>Designed with ♥ for young athletes across India</p>
        </div>
      </footer> */}
    </div>
  );
};

export default AboutPage;