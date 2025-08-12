import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../pages_css/Profile.css'; // Corrected path for your folder structure

const Profile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        profilePicture: '',
        username: '',
        age: '',
        gender: '',
        location: '',
        sport: '',
        level: 'Beginner',
        bio: '',
        achievements: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // This is where you would handle form submission,
        // for example, sending data to your backend API.
        console.log('Form data submitted:', formData);
        // alert('Profile Created! (Check console for data)');
        // alert(formData.username + " Profile Created Successfully!"); // Alert with username

        try {
            await api.post("/auth/update", formData);
            alert("Profile Updated successfully!");
            // navigate(`/`);
            navigate("/splash");
        } catch (err) {
            console.error(err);
            alert("Registration failed",err);
        }
    };

    return (
        <div className="profile-form-container">
            <section className="profile-header">
                UPDATE YOUR PROFILE
            </section>
            <form onSubmit={handleSubmit} className="profile-form">
                {/* Personal Information Section */}
                <div className="form-section">
                    <h2 className="section-title">Personal Information</h2>
                    <div className="form-group profile-photo-group">
                        {/* <div className="photo-placeholder">
                            
                        </div> */}
                        {/* <button type="button" className="btn change-btn">Change</button> */}
                        <label htmlFor="profilePicture">Profile link</label>
                        <input type="text" id="fullName" name="profilePicture" value={formData.profilePicture} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="username">Full Name</label>
                            <input type="text" id="fullName" name="username" value={formData.username} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Age</label>
                            <input type="text" id="dateOfBirth" name="age" placeholder="Enter your Age" value={formData.age} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location (City, State)</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Athletic Information Section */}
                <div className="form-section">
                    <h2 className="section-title">Athletic Information</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="sport">Primary Sport</label>
                            <select id="sport" name="sport" value={formData.sport} onChange={handleChange}>
                                <option value="">Select Sport</option>
                                <option value="cricket">Cricket</option>
                                <option value="badminton">Badminton</option>
                                <option value="football">Football</option>
                                <option value="basketball">Basketball</option>
                                <option value="hockey">Hockey</option>
                                <option value="athletics">Athletics</option>
                                <option value="volleyball">Volleyball</option>
                                <option value="tennis">Tennis</option>
                                <option value="swimming">Swimming</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="level">Current Level</label>
                            <select id="currentLevel" name="level" value={formData.level} onChange={handleChange}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" name="bio" placeholder="Tell us about yourself, your journey, and your sporting aspirations..." value={formData.bio} onChange={handleChange}></textarea>
                        <p className="field-description">Brief description about your athletic journey.</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="achievements">Achievements</label>
                        <textarea id="achievements" name="achievements" placeholder="List your major achievements, awards, and recognitions..." value={formData.achievements} onChange={handleChange}></textarea>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="form-section">
                    <h2 className="section-title">Contact Information</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="form-buttons">
                    {/* <button type="button" className="btn cancel-btn">Cancel</button> */}
                    <button type="submit" className="btn create-profile-btn">Update Profile</button>
                </div>
            </form>
        </div>
    );
};

export default Profile;