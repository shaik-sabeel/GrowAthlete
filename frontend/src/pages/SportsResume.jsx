// src/pages/SportsResume.jsx
import React, { useState } from 'react';
import "../pages_css/SportsResume.css"; // Keep if you have specific custom CSS not handled by Tailwind, or remove if only using Tailwind
import Navbar from '../components/Navbar'; // Assuming your Navbar component exists here
import axios from 'axios'; // For API calls if your api.js uses axios directly, otherwise remove if api.js abstracts it entirely
import api from '../utils/api'; // Your custom API utility, crucial for form submission
import { useNavigate, Link } from 'react-router-dom'; // Using Link for client-side navigation instead of <a> where appropriate

export default function SportsResume() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '', // Renamed from dob for clarity consistent with V2
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    address: '', // Added from V2
    
    // Athletic Details
    primarySport: '', // Renamed from sport for clarity consistent with V2
    position: '',
    height: '',
    weight: '',
    dominantHand: '', // Renamed from dominantSide for clarity consistent with V2
    currentTeam: '',
    
    // Education (Added from V2)
    education: '',
    
    // Career Stats
    careerStats: '',
    
    // Achievements
    achievements: '',
    
    // Tournament History (Added from V2)
    tournaments: '',
    
    // Skills and Attributes
    skills: '',
    
    // Certifications (Added from V2)
    certifications: '',
    
    // Professional References (Added from V2)
    references: '',
    
    // Video Links (Added from V2)
    videoLinks: '',
    
    // Social Media Profiles (Added from V2)
    socialMedia: '',
  });
  
  const [profileImage, setProfileImage] = useState(null); // Changed from 'photo' in V1 to 'profileImage' for consistency with V2 field name
  const [isSubmitting, setIsSubmitting] = useState(false); // State for handling form submission status

  // Universal handler for all text, select, and textarea inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for image file input
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    } else {
      setProfileImage(null); // Clear image if no file is selected
    }
  };

  // Submit handler for the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button and show loading

    try {
      const data = new FormData();
      // Append all formData fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append the profile image if present
      if (profileImage) {
        data.append('profileImage', profileImage); // Ensure your backend expects 'profileImage' for the file
      }

      // API call using your `api` utility from V1
      const res = await api.post("/sports-resume", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume saved successfully!");
      console.log("Server response:", res.data);
      // Assuming "/resume-template" is the route to view the resume (like input_file_4.ts functionality)
      navigate("/resume-template"); 
    } catch (error) {
      console.error("Error saving resume:", error.response?.data || error.message);
      alert("Error saving resume: " + (error.response?.data?.message || "Please try again."));
    } finally {
      setIsSubmitting(false); // Re-enable button after submission attempt
    }
  };

  return (
    <div className="bg-white-50 min-h-screen">
      <Navbar /> {/* Render the Navbar */}
      
      {/* Hero Section with Background Image (from V2 UI) */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black-700 mix-blend-multiply" />
          {/* <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Sports background"
          /> */}
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" id="build-your-athletic-profile">
            Build Your Athletic Profile
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-indigo-100">
            Create a professional sports resume to showcase your skills, achievements, and potential to teams, scouts, and recruiters.
          </p>
          <div className="mt-10 flex justify-center">
            {/* Direct anchor link for scroll to form */}
            <a 
              href="#resume-form" 
              className="get-started"
            >
              Get Started
            </a>
            {/* Link to view resume. Update the 'to' prop based on your actual route for ViewSportsResumePage */}
            {/* <Link 
              to="/view-sports-resume" 
              className="inline-flex items-center ml-3 px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70"
            >
              View Example
            </Link> */}
          </div>
          
          {/* Feature Cards (from V2 UI) */}
          <div className="mt-20 max-w-7xl mx-auto" >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" >
              {/* Feature 1 */}
              <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl" id="features">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      {/* Icon SVGs from V2 */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">Professional Profile</h3>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Create a comprehensive athletic profile that highlights your strengths, experience, and achievements.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl" id="features">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">Get Discovered</h3>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Increase your visibility to coaches, scouts, and recruiters who are looking for talent in your sport.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl" id="features">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">Showcase Achievements</h3>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Display your medals, trophies, records, and performances to demonstrate your competitive success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Form Section (from V2 UI structure with combined fields) */}
      <div id="resume-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red shadow overflow-hidden sm:rounded-lg"id="resume-form">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-8" >
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 pb-2 border-b border-gray-200">
                    Personal Information
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6" >
                    <div className="sm:col-span-6">
                      <label htmlFor="profileImage" className="block text-sm font-medium text-gray-100">
                        Profile Photo
                      </label>
                      <div className="mt-1 flex items-center">
                        <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {profileImage ? (
                            <img
                              src={URL.createObjectURL(profileImage)}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-5">
                          <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                          <label
                            htmlFor="profileImage"
                            className="bg-gray-500 py-2 px-3 border border-gray-50 rounded-md shadow-sm text-sm border leading-4 font-medium text-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" // Removed focus:ring-offset-2
                            id="upload-photo"
                          >
                            Upload Photo
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">
                        Date of Birth
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                        Gender
                      </label>
                      <div className="mt-1">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border p-2 text-gray-100 border-gray-300 rounded-md"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-300">
                        Nationality
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="nationality"
                          id="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 text-gray-100 sm:text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Athletic Details Section */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-300 pb-2 border-b border-gray-200">
                    Athletic Details
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="primarySport" className="block text-sm font-medium text-gray-300">
                        Primary Sport
                      </label>
                      <div className="mt-1">
                        <select
                          id="primarySport"
                          name="primarySport"
                          value={formData.primarySport}
                          onChange={handleInputChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        >
                          <option value="">Select Sport</option>
                          <option value="cricket">Cricket</option>
                          <option value="football">Football</option>
                          <option value="hockey">Hockey</option>
                          <option value="basketball">Basketball</option>
                          <option value="badminton">Badminton</option>
                          <option value="tennis">Tennis</option>
                          <option value="table-tennis">Table Tennis</option>
                          <option value="athletics">Athletics</option>
                          <option value="swimming">Swimming</option>
                          <option value="kabaddi">Kabaddi</option>
                          <option value="volleyball">Volleyball</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="position" className="block text-sm font-medium text-gray-300">
                        Position / Specialization
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="position"
                          id="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          placeholder="e.g., Striker, Midfielder, Batsman, etc."
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="height" className="block text-sm font-medium text-gray-300">
                        Height (cm)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="height"
                          id="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-300">
                        Weight (kg)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="weight"
                          id="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="dominantHand" className="block text-sm font-medium text-gray-300">
                        Dominant Hand/Foot
                      </label>
                      <div className="mt-1">
                        <select
                          id="dominantHand"
                          name="dominantHand"
                          value={formData.dominantHand}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        >
                          <option value="">Select</option>
                          <option value="right">Right</option>
                          <option value="left">Left</option>
                          <option value="ambidextrous">Ambidextrous</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="currentTeam" className="block text-sm font-medium text-gray-300">
                        Current Team/Club/School (if applicable)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="currentTeam"
                          id="currentTeam"
                          value={formData.currentTeam}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-300 pb-2 border-b border-gray-200">
                    Education
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="education" className="block text-sm font-medium text-gray-300">
                        Educational Background
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="education"
                          name="education"
                          rows={3}
                          value={formData.education}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="List your educational qualifications, schools/colleges attended with years"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Stats Section */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-300 pb-2 border-b border-gray-200">
                    Career Statistics
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="careerStats" className="block text-sm font-medium text-gray-300">
                        Key Career Statistics
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="careerStats"
                          name="careerStats"
                          rows={4}
                          value={formData.careerStats}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="For Cricket: Batting average, bowling economy, matches played, etc.
For Football: Goals scored, assists, matches played, etc.
For other sports: Include relevant statistics."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements Section */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-300 pb-2 border-b border-gray-200">
                    Achievements
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="achievements" className="block text-sm font-medium text-gray-300">
                        Awards and Achievements
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="achievements"
                          name="achievements"
                          rows={4}
                          value={formData.achievements}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="List your awards, medals, recognition, records, etc. with dates"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tournament History */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-300 pb-2 border-b border-gray-200">
                    Tournament History
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="tournaments" className="block text-sm font-medium text-gray-300">
                        Tournament/Championship Participation
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="tournaments"
                          name="tournaments"
                          rows={4}
                          value={formData.tournaments}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="List major tournaments/championships you've participated in with dates, venues, and results"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-300 pb-2 border-b border-gray-200">
                    Skills and Attributes
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-300">
                        Key Skills and Attributes
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="skills"
                          name="skills"
                          rows={3}
                          value={formData.skills}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="E.g., Speed, Agility, Leadership, Team player, Technical skills specific to your sport"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-300 pb-2 border-b border-gray-200">
                    Certifications
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="certifications" className="block text-sm font-medium text-gray-300">
                        Sports-related Certifications
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="certifications"
                          name="certifications"
                          rows={3}
                          value={formData.certifications}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="List any coaching licenses, first aid certificates, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* References */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-300 pb-2 border-b border-gray-200">
                    Professional References
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="references" className="block text-sm font-medium text-gray-300">
                        Coaches/Mentors References
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="references"
                          name="references"
                          rows={3}
                          value={formData.references}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="Name, position, contact details of coaches or mentors who can provide references"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Links */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 pb-2 border-b border-gray-200">
                    Video Highlights
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="videoLinks" className="block text-sm font-medium text-gray-300">
                        Video Links
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="videoLinks"
                          name="videoLinks"
                          rows={2}
                          value={formData.videoLinks}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="YouTube, Vimeo, or other links to your performance highlights"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 pb-2 border-b border-gray-200">
                    Social Media Profiles
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-300">
                        Social Media Links
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="socialMedia"
                          name="socialMedia"
                          rows={2}
                          value={formData.socialMedia}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 p-2 text-gray-100 rounded-md"
                          placeholder="Instagram, Twitter, LinkedIn, Facebook, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-5 border-t border-gray-200">
                  <div className="flex justify-end">
                    {/* Using onClick with navigate for "Cancel" */}
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm p-2 text-gray-100 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" // Removed focus:ring-offset-2
                    >
                      Cancel
                    </button>
                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent p-2 text-gray-100 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" // Removed focus:ring-offset-2
                    >
                      {isSubmitting ? "Creating..." : "Create Resume"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}