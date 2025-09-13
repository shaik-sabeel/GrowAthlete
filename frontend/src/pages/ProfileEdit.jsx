import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaUserEdit, FaUpload, FaSave, FaBan, FaLink, FaImage, FaPhone, FaMedal, FaInstagram, FaTwitter, FaFacebookF, FaLinkedin, FaYoutube, FaGlobe, FaTools } from 'react-icons/fa'; // Consolidated imports

// Let's create ProfileEdit.css for tailored styling.
import '../pages_css/ProfileEdit.css'; 

const ProfileEdit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        age: '',
        gender: '',
        location: '',
        sport: '',
        level: '', // Default empty to show placeholder
        bio: '',
        achievements: '',
        phone: '',
        // For profilePicture: store URL as string initially, file handled separately
        profilePictureUrl: '', 
        // Social links (ensure they are all strings)
        socialLinks: {
            instagram: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            youtube: '',
            website: '',
        }
    });
    const [profileImageFile, setProfileImageFile] = useState(null); // File object for new upload
    const [imagePreview, setImagePreview] = useState(null); // Local URL for image preview
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const defaultAvatar = "https://res.cloudinary.com/dvlyrgrsd/image/upload/v1718957805/default-avatar.png"; // Your default avatar URL

    // Fetch existing user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/auth/profile');
                const user = res.data.user;

                // Safely initialize socialLinks to ensure all properties exist as empty strings if null
                const initializedSocialLinks = {
                    instagram: user.socialLinks?.instagram || '',
                    twitter: user.socialLinks?.twitter || '',
                    facebook: user.socialLinks?.facebook || '',
                    linkedin: user.socialLinks?.linkedin || '',
                    youtube: user.socialLinks?.youtube || '',
                    website: user.socialLinks?.website || '',
                };

                setFormData({
                    username: user.username || '',
                    age: user.age || '',
                    gender: user.gender || '',
                    location: user.location || '',
                    sport: user.sport || '',
                    level: user.level || '',
                    bio: user.bio || '',
                    achievements: user.achievements || '',
                    phone: user.phone || '',
                    profilePictureUrl: user.profilePicture || defaultAvatar, // Set current URL
                    socialLinks: initializedSocialLinks
                });
                // Set image preview from fetched URL (correcting local /uploads path)
                setImagePreview(user.profilePicture && user.profilePicture.startsWith('/uploads') ? `https://growathlete.onrender.com${user.profilePicture}` : user.profilePicture || defaultAvatar);
            } catch (err) {
                console.error('Error fetching user data for edit:', err);
                setError('Failed to load user data. Please ensure you are logged in. Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000); // Redirect to login on error
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImageFile(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Show local preview for file
        } else {
            // If file selection is cancelled, revert to current URL or default
            setImagePreview(formData.profilePictureUrl && formData.profilePictureUrl.startsWith('/uploads') ? `https://growathlete.onrender.com${formData.profilePictureUrl}` : formData.profilePictureUrl || defaultAvatar); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            // 1. Upload new profile picture if a file is selected
            if (profileImageFile) {
                const formDataFile = new FormData();
                formDataFile.append('profilePicture', profileImageFile);
                const picRes = await api.post('/auth/profile/picture', formDataFile);
                setMessage(prev => (prev ? prev + '. ' : '') + picRes.data.message);
                // Update the profilePictureUrl in formData state
                setFormData(prev => ({ 
                    ...prev, 
                    profilePictureUrl: picRes.data.user.profilePicture // Path from server, e.g., /uploads/profiles/file.png
                }));
                setProfileImageFile(null); // Clear file input state after successful upload
            }

            // 2. Prepare other profile fields for update (sends non-file data)
            const profileDataToUpdate = {
                username: formData.username,
                age: formData.age,
                gender: formData.gender,
                location: formData.location,
                sport: formData.sport,
                level: formData.level,
                bio: formData.bio,
                achievements: formData.achievements,
                phone: formData.phone,
                socialLinks: formData.socialLinks,
                // Only include profilePicture field if it's explicitly a URL from form, 
                // OR if it's been successfully uploaded and we now have the server path (updated in formData.profilePictureUrl)
                profilePicture: formData.profilePictureUrl.startsWith('http') || formData.profilePictureUrl.startsWith('/uploads') ? formData.profilePictureUrl : undefined
            };
            
            const res = await api.post('/auth/update', profileDataToUpdate); // This route updates the non-file fields
            setMessage(prev => (prev ? prev + '. ' : '') + res.data.message);
            // After successful save, navigate to view page after a small delay
            setTimeout(() => navigate('/profile'), 1500); 

        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please ensure all required fields are correct.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="profile-edit-container flex items-center justify-center">
                    <p className="text-xl text-gray-700">Loading your profile data...</p>
                </div>
            </>
        );
    }

    // Error from fetching user data, but not during submission
    if (error && !submitting) {
        return (
            <>
                <Navbar />
                <div className="profile-edit-container flex flex-col items-center justify-center text-red-600 text-lg">
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Go to Login</button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profile-edit-container py-12 px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="profile-edit-form">
                    <h1 className="form-header flex items-center justify-center text-center">
                        <FaUserEdit className="mr-3 text-indigo-500" /> Update My Profile
                    </h1>
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}

                    {/* Profile Picture Section */}
                    <div className="form-section">
                        <h2 className="section-title flex items-center"><FaImage className="mr-2 text-purple-500" /> Profile Picture</h2>
                        <div className="flex flex-col items-center gap-4">
                            <img 
                                src={imagePreview || defaultAvatar} 
                                alt="Profile Preview" 
                                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-300 shadow-md"
                            />
                            <label className="profile-upload-btn">
                                <FaUpload className="mr-2" /> Upload New Photo
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageFileChange} 
                                    className="hidden" 
                                />
                            </label>
                            {/* If a new file is selected, but not yet uploaded, offer to revert */}
                            {profileImageFile && (
                                <button 
                                    type="button" 
                                    onClick={() => { setProfileImageFile(null); setImagePreview(formData.profilePictureUrl && formData.profilePictureUrl.startsWith('/uploads') ? `https://growathlete.onrender.com${formData.profilePictureUrl}` : formData.profilePictureUrl || defaultAvatar); }}
                                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                                >
                                    Cancel local upload
                                </button>
                            )}
                            {/* Input for image URL */}
                            <input
                                type="url"
                                name="profilePictureUrl"
                                value={!profileImageFile ? formData.profilePictureUrl : ''} // Only show if no file selected
                                onChange={handleChange}
                                disabled={!!profileImageFile} // Disable if file is selected
                                placeholder={profileImageFile ? 'Clear file upload to use URL' : "Or paste an image URL"}
                                className="text-input text-center"
                            />
                            {!profileImageFile && formData.profilePictureUrl && !formData.profilePictureUrl.startsWith('/uploads') && (
                                <span className="text-sm text-gray-500 italic mt-1">Using external URL for profile picture.</span>
                            )}
                            {profileImageFile && (
                                <span className="text-sm text-gray-500 italic mt-1">New photo selected: {profileImageFile.name}</span>
                            )}

                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="form-section">
                        <h2 className="section-title flex items-center"><FaUserEdit className="mr-2 text-blue-500" /> Personal Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label htmlFor="username">Full Name</label>
                                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required className="text-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input type="text" id="age" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., 22" className="text-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="select-input">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location (City, State)</label>
                                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Hyderabad, Telangana" className="text-input" />
                            </div>
                        </div>
                    </div>

                    {/* Athletic Information */}
                    <div className="form-section">
                        <h2 className="section-title flex items-center"><FaMedal className="mr-2 text-green-500" /> Athletic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label htmlFor="sport">Primary Sport</label>
                                <select id="sport" name="sport" value={formData.sport} onChange={handleChange} className="select-input">
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
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="level">Current Level</label>
                                <select id="level" name="level" value={formData.level} onChange={handleChange} className="select-input">
                                    <option value="">Select Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group mt-6">
                            <label htmlFor="bio">Bio (max 500 characters)</label>
                            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} maxLength="500" placeholder="Tell us about your athletic journey and aspirations..." className="textarea-input"></textarea>
                        </div>
                        <div className="form-group mt-6">
                            <label htmlFor="achievements">Key Achievements</label>
                            <textarea id="achievements" name="achievements" value={formData.achievements} onChange={handleChange} placeholder="List your major achievements, awards, and recognitions (one per line)..." className="textarea-input"></textarea>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="form-section">
                        <h2 className="section-title flex items-center"><FaPhone className="mr-2 text-red-500" /> Contact Info</h2>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., +91 9876543210" className="text-input" />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="form-section">
                        <h2 className="section-title flex items-center"><FaLink className="mr-2 text-yellow-500" /> Social Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label htmlFor="instagram" className="flex items-center gap-2"><FaInstagram /> Instagram URL</label>
                                <input type="url" id="instagram" name="instagram" value={formData.socialLinks.instagram} onChange={handleSocialLinkChange} placeholder="e.g., https://instagram.com/yourprofile" className="text-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="twitter" className="flex items-center gap-2"><FaTwitter /> Twitter URL</label>
                                <input type="url" id="twitter" name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialLinkChange} placeholder="e.g., https://twitter.com/yourprofile" className="text-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="facebook" className="flex items-center gap-2"><FaFacebookF /> Facebook URL</label>
                                <input type="url" id="facebook" name="facebook" value={formData.socialLinks.facebook} onChange={handleSocialLinkChange} placeholder="e.g., https://facebook.com/yourprofile" className="text-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="linkedin" className="flex items-center gap-2"><FaLinkedin /> LinkedIn URL</label>
                                <input type="url" id="linkedin" name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialLinkChange} placeholder="e.g., https://linkedin.com/in/yourprofile" className="text-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="youtube" className="flex items-center gap-2"><FaYoutube /> YouTube URL</label>
                                <input type="url" id="youtube" name="youtube" value={formData.socialLinks.youtube} onChange={handleSocialLinkChange} placeholder="e.g., https://youtube.com/yourchannel" className="text-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="website" className="flex items-center gap-2"><FaGlobe /> Personal Website</label>
                                <input type="url" id="website" name="website" value={formData.socialLinks.website} onChange={handleSocialLinkChange} placeholder="e.g., https://yourpersonalwebsite.com" className="text-input" />
                            </div>
                        </div>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="form-actions-bottom">
                        <button 
                            type="button" 
                            onClick={() => navigate('/profile')} 
                            className="cancel-btn flex items-center"
                        >
                            <FaBan className="mr-2" /> Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="submit-btn flex items-center"
                        >
                            {submitting ? (
                                <>
                                    <FaTools className="mr-2 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProfileEdit;