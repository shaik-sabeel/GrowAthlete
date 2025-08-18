// MyProfile.jsx

import React,{useState,useEffect} from 'react';
import api from '../utils/api'; // Adjust the import path as necessary
import '../pages_css/MyProfile.css'; // Importing the updated styles
import Navbar from '../components/Navbar';

// Sample user data remains the same
const sampleUser = {
  profileImage: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQXeXnNZ_jQQhRAwxYQIozYTYVHvjzfhZ-yOwOUNAWy_aD3oUhFNIG4F565r02jc6sbtvvbnKhe4Zmsmj8', // Swapped for a new image that fits the design
  profileLink: "https://growathlete.com/user/priya_sharma",
  fullName: "Priya Sharma",
  age: 21,
  gender: "Female",
  location: "Bangalore, Karnataka",
  primarySport: "Badminton",
  currentLevel: "Advanced",
  bio: "A dedicated badminton player with a passion for the sport. My journey began in school, and I have since competed at state and national levels. I believe in consistent hard work and pushing my limits every day. My ultimate goal is to represent India at the international level and make my country proud.",
  achievements: "• Gold Medalist, 2023 National University Games\n• Two-time State Champion (2022, 2023)\n• 'Emerging Athlete of the Year' Award, State Badminton Federation 2022",
  email: "priya.sharma@example.com",
  phone: "+91 91234 56789"
};


const MyProfile = () => {


    const [user, setUser] = useState({});
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await api.get("/auth/profile");
            setUser(res.data.user);
          } catch (err) {
            alert("Error fetching profile data. Please try again later.");
            console.error("Error fetching profile data:", err);
          }
        };
        fetchData();
      }, []);


//   const user = sampleUser;

  return (
    <>
    <Navbar />
    <div className="profile-page-container">
      {/* The header is now separate from the main card */}
      <header className="profile-header">
        <div className="profile-picture-container">
            <img src={user.profilePicture} alt={`${user.username}`} className="profile-picture" />
        </div>
        <h1 className="profile-name">{user.username}</h1>
        {/* Added sport and level here as requested */}
        <p className="profile-sport">{user.sport} | {user.level} Level</p>
      </header>

      {/* This card contains all the informational sections */}
      <div className="profile-card">
        {/* Personal Information Section */}
        <section className="profile-section">
          <h2 className="section-title">Personal Information</h2>
          {/* Using a specific grid class for the unique layout */}
          <div className="personal-info-grid">
            <div className="info-item">
              <span className="info-label">Age</span>
              <span className="info-value">{user.age}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">{user.gender}</span>
            </div>
            <div className="info-item location-item">
              <span className="info-label">Location</span>
              <span className="info-value">{user.location}</span>
            </div>
          </div>
        </section>

        {/* Athletic Information Section */}
        <section className="profile-section">
          <h2 className="section-title">Athletic Information</h2>
          <div className="athletic-info-container">
            <div className="info-item">
                <span className="info-label">Bio</span>
                <p className="info-text">{user.bio}</p>
            </div>
            <div className="info-item">
                <span className="info-label">Achievements</span>
                <p className="info-text achievements-text">{user.achievements}</p>
            </div>
              <div className="info-item">
                {/* <span className="info-label">Profile Link</span>
                <span className="info-value">
                    <a href={user.profileLink} target="_blank" rel="noopener noreferrer">{user.profileLink}</a>
                </span> */}
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="profile-section">
          <h2 className="section-title">Contact Information</h2>
          <div className="contact-info-grid">
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone Number</span>
              <span className="info-value">{user.phone}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default MyProfile;