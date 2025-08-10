import React, { useState } from 'react';
import '../pages_css/Profile.css'; // Corrected path for your folder structure

const Profile = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        location: '',
        primarySport: '',
        currentLevel: 'Beginner',
        bio: '',
        achievements: '',
        emailAddress: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // This is where you would handle form submission,
        // for example, sending data to your backend API.
        console.log('Form data submitted:', formData);
        alert('Profile Created! (Check console for data)');
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
                        <div className="photo-placeholder">
                            {/* You can add an img tag here for a default avatar */}
                        </div>
                        <button type="button" className="btn change-btn">Change</button>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <input type="text" id="dateOfBirth" name="dateOfBirth" placeholder="dd-mm-yyyy" value={formData.dateOfBirth} onChange={handleChange} />
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
                            <label htmlFor="primarySport">Primary Sport</label>
                            <select id="primarySport" name="primarySport" value={formData.primarySport} onChange={handleChange}>
                                <option value="">Select Sport</option>
                                <option value="basketball">Basketball</option>
                                <option value="soccer">Soccer</option>
                                <option value="tennis">Tennis</option>
                                <option value="swimming">Swimming</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="currentLevel">Current Level</label>
                            <select id="currentLevel" name="currentLevel" value={formData.currentLevel} onChange={handleChange}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Professional">Professional</option>
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
                            <label htmlFor="emailAddress">Email Address</label>
                            <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="form-buttons">
                    <button type="button" className="btn cancel-btn">Cancel</button>
                    <button type="submit" className="btn create-profile-btn">Create Profile</button>
                </div>
            </form>
        </div>
    );
};

export default Profile;