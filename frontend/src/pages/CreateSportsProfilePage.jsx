// frontend/src/pages/CreateSportsProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySportsProfile, createSportsProfile, updateSportsProfile, uploadProfilePicture } from '../utils/api';
// Removed: import './pages_css/CreateSportsProfilePage.css'; // No longer needed

const CreateSportsProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        bio: '',
        sports: [{ name: '', specialization: '' }],
        experience: [{ teamClub: '', yearsPlayed: '', tournaments: [''], achievements: [''] }],
        skillsAttributes: ['']
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [currentProfilePicUrl, setCurrentProfilePicUrl] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMySportsProfile();
                if (res.data.profileExists === false) {
                    setIsEditMode(false);
                } else {
                    setProfile(res.data);
                    setCurrentProfilePicUrl(res.data.profilePicture);
                    setIsEditMode(true);
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSportsChange = (index, e) => {
        const { name, value } = e.target;
        const newSports = profile.sports.map((sport, i) => (
            i === index ? { ...sport, [name]: value } : sport
        ));
        setProfile(prev => ({ ...prev, sports: newSports }));
    };

    const addSport = () => {
        setProfile(prev => ({
            ...prev,
            sports: [...prev.sports, { name: '', specialization: '' }]
        }));
    };

    const removeSport = (index) => {
        setProfile(prev => ({
            ...prev,
            sports: prev.sports.filter((_, i) => i !== index)
        }));
    };

    const handleExperienceChange = (index, e) => {
        const { name, value } = e.target;
        const newExperience = profile.experience.map((exp, i) => (
            i === index ? { ...exp, [name]: value } : exp
        ));
        setProfile(prev => ({ ...prev, experience: newExperience }));
    };

    const handleExperienceArrayChange = (expIndex, field, itemIndex, e) => {
        const newExperience = profile.experience.map((exp, i) => {
            if (i === expIndex) {
                const newArray = [...exp[field]];
                newArray[itemIndex] = e.target.value;
                return { ...exp, [field]: newArray };
            }
            return exp;
        });
        setProfile(prev => ({ ...prev, experience: newExperience }));
    };

    const addExperienceArrayItem = (expIndex, field) => {
        const newExperience = profile.experience.map((exp, i) => {
            if (i === expIndex) {
                return { ...exp, [field]: [...exp[field], ''] };
            }
            return exp;
        });
        setProfile(prev => ({ ...prev, experience: newExperience }));
    };

    const removeExperienceArrayItem = (expIndex, field, itemIndex) => {
        const newExperience = profile.experience.map((exp, i) => {
            if (i === expIndex) {
                return { ...exp, [field]: exp[field].filter((_, j) => j !== itemIndex) };
            }
            return exp;
        });
        setProfile(prev => ({ ...prev, experience: newExperience }));
    };

    const addExperience = () => {
        setProfile(prev => ({
            ...prev,
            experience: [...prev.experience, { teamClub: '', yearsPlayed: '', tournaments: [''], achievements: [''] }]
        }));
    };

    const removeExperience = (index) => {
        setProfile(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleSkillsAttributesChange = (index, e) => {
        const newSkills = profile.skillsAttributes.map((skill, i) => (
            i === index ? e.target.value : skill
        ));
        setProfile(prev => ({ ...prev, skillsAttributes: newSkills }));
    };

    const addSkillAttribute = () => {
        setProfile(prev => ({ ...prev, skillsAttributes: [...prev.skillsAttributes, ''] }));
    };

    const removeSkillAttribute = (index) => {
        setProfile(prev => ({ ...prev, skillsAttributes: prev.skillsAttributes.filter((_, i) => i !== index) }));
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = isEditMode
                ? await updateSportsProfile(profile)
                : await createSportsProfile(profile);
            setMessage(res.data.message);

            if (profilePicture) {
                const formData = new FormData();
                formData.append('profilePicture', profilePicture);
                const picRes = await uploadProfilePicture(formData);
                setCurrentProfilePicUrl(picRes.data.profilePicture);
                setMessage(prev => prev + ' ' + picRes.data.message);
            }
            navigate(`/profile/me`);
        } catch (err) {
            console.error('Submission failed:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'An error occurred during profile submission.');
        }
    };

    if (loading) return <div className="text-center text-lg py-12 text-gray-600">Loading profile data...</div>;

    return (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-xl font-sans">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                {isEditMode ? 'Edit Your Sports Profile' : 'Create Your Sports Profile'}
            </h1>
            {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">{error}</p>}
            {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="bio" className="block text-gray-700 text-lg font-semibold mb-2">Bio:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        rows="5"
                        maxLength="500"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                        placeholder="Tell us about yourself as an athlete..."
                    ></textarea>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <label className="block text-gray-700 text-lg font-semibold mb-4">Profile Picture:</label>
                    {currentProfilePicUrl && (
                        <img
                            src={`https://growathlete.onrender.com/${currentProfilePicUrl}`}
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
                        />
                    )}
                    <input
                        type="file"
                        onChange={handleProfilePictureChange}
                        className="text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                </div>

                {/* Sports Section */}
                <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3 border-gray-200">Sports & Specialization</h2>
                {profile.sports.map((sport, index) => (
                    <div key={index} className="bg-blue-50 p-6 rounded-lg mb-5 border border-blue-200 relative shadow-sm">
                        <input
                            type="text"
                            name="name"
                            placeholder="Sport Name (e.g., Football)"
                            value={sport.name}
                            onChange={(e) => handleSportsChange(index, e)}
                            className="w-1/2 p-3 border border-gray-300 rounded-lg text-base mb-3 mr-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            name="specialization"
                            placeholder="Specialization (e.g., Striker)"
                            value={sport.specialization}
                            onChange={(e) => handleSportsChange(index, e)}
                            className="w-1/2 p-3 border border-gray-300 rounded-lg text-base mb-3 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <button
                            type="button"
                            onClick={() => removeSport(index)}
                            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full text-sm font-semibold hover:bg-red-600 transition duration-200 shadow-md"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addSport}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md block mx-auto mb-10"
                >
                    Add Sport
                </button>

                {/* Experience Section */}
                <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3 border-gray-200">Experience</h2>
                {profile.experience.map((exp, expIndex) => (
                    <div key={expIndex} className="bg-yellow-50 p-6 rounded-lg mb-8 border border-yellow-200 relative shadow-sm">
                        <input
                            type="text"
                            name="teamClub"
                            placeholder="Team/Club Name"
                            value={exp.teamClub}
                            onChange={(e) => handleExperienceChange(expIndex, e)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base mb-4 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                        <input
                            type="text"
                            name="yearsPlayed"
                            placeholder="Years Played (e.g., 2018-2020)"
                            value={exp.yearsPlayed}
                            onChange={(e) => handleExperienceChange(expIndex, e)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base mb-4 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                        <textarea
                            name="description"
                            placeholder="Description of your role/time here"
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(expIndex, e)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base mb-4 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                            rows="3"
                        ></textarea>

                        <h3 className="text-xl font-semibold text-gray-600 mb-3 mt-6">Tournaments</h3>
                        {exp.tournaments.map((tournament, tourIndex) => (
                            <div key={tourIndex} className="flex items-center mb-3">
                                <input
                                    type="text"
                                    value={tournament}
                                    onChange={(e) => handleExperienceArrayChange(expIndex, 'tournaments', tourIndex, e)}
                                    placeholder="Tournament Name"
                                    className="flex-grow p-3 border border-gray-300 rounded-lg text-base mr-3 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExperienceArrayItem(expIndex, 'tournaments', tourIndex)}
                                    className="bg-red-400 text-white p-2 rounded-md text-sm font-semibold hover:bg-red-500 transition duration-200 shadow-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addExperienceArrayItem(expIndex, 'tournaments')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-600 transition duration-200 shadow-md block mt-4 mx-auto"
                        >
                            Add Tournament
                        </button>

                        <h3 className="text-xl font-semibold text-gray-600 mb-3 mt-6">Achievements</h3>
                        {exp.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-center mb-3">
                                <input
                                    type="text"
                                    value={achievement}
                                    onChange={(e) => handleExperienceArrayChange(expIndex, 'achievements', achIndex, e)}
                                    placeholder="Achievement"
                                    className="flex-grow p-3 border border-gray-300 rounded-lg text-base mr-3 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExperienceArrayItem(expIndex, 'achievements', achIndex)}
                                    className="bg-red-400 text-white p-2 rounded-md text-sm font-semibold hover:bg-red-500 transition duration-200 shadow-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addExperienceArrayItem(expIndex, 'achievements')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-600 transition duration-200 shadow-md block mt-4 mx-auto"
                        >
                            Add Achievement
                        </button>

                        <button
                            type="button"
                            onClick={() => removeExperience(expIndex)}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-300 shadow-md block mt-8 mx-auto"
                        >
                            Remove Experience Section
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addExperience}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md block mx-auto mb-10"
                >
                    Add Experience Section
                </button>

                {/* Skills & Attributes */}
                <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3 border-gray-200">Skills & Attributes</h2>
                {profile.skillsAttributes.map((skill, index) => (
                    <div key={index} className="bg-purple-50 p-6 rounded-lg mb-5 border border-purple-200 relative shadow-sm">
                        <input
                            type="text"
                            placeholder="Skill/Attribute (e.g., Leadership, Speed)"
                            value={skill}
                            onChange={(e) => handleSkillsAttributesChange(index, e)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3 focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                        <button
                            type="button"
                            onClick={() => removeSkillAttribute(index)}
                            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full text-sm font-semibold hover:bg-red-600 transition duration-200 shadow-md"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addSkillAttribute}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md block mx-auto mb-10"
                >
                    Add Skill/Attribute
                </button>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition duration-300 shadow-lg mt-8"
                >
                    {isEditMode ? 'Save Changes' : 'Create Profile'}
                </button>
            </form>
        </div>
    );
};

export default CreateSportsProfilePage;