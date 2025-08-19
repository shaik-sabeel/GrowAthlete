import React, { useState } from "react";
import "../pages_css/SportsResume.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import api from "../utils/api"; // Adjust the import based on your API setup
import { useNavigate } from "react-router-dom";

const SportsResume = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    sport: "",
    position: "",
    height: "",
    weight: "",
    dominantSide: "",
    currentTeam: "",
    careerStats: "",
    skills: "",
    achievements: "",
  });

  const [photo, setPhoto] = useState(null);

  // For text, select, textarea inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For image upload
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      // append all text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // append file
      if (photo) {
        data.append("photo", photo);
      }

      const res = await api.post("/sports-resume", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume saved successfully!");
      console.log(res.data);
      navigate("/resume-template"); 
    } catch (error) {
      console.error(error);
      alert("Error saving resume.");
    }
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto p-10 bg-black-50 min-h-screen"
      >
        <h1
          className="py-10 text-3xl font-bold text-center text-indigo-600 mb-8"
          style={{ color: "white" }}
        >
          Sports Resume
        </h1>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Profile"
                    className="w-28 h-28 object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Photo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-1">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>
        </div>

        {/* Athletic Details */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Athletic Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            >
              
              <option value="">Select Sport</option>
              <option>Cricket</option>
              <option>Football</option>
              <option>Basketball</option>
              <option>Badminton</option>
              <option>Tennis</option>
              <option>Swimming</option>
              <option>Volleyball</option>
              <option>Athletics</option>
              <option>Hockey</option>
              <option>Other</option>
            </select>
            <input
              type="text"
              name="position"
              placeholder="Position / Specialization"
              value={formData.position}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={formData.height}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <select
              name="dominantSide"
              value={formData.dominantSide}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            >
              <option value="">Dominant Hand/Foot</option>
              <option>Left</option>
              <option>Right</option>
            </select>
            <input
              type="text"
              name="currentTeam"
              placeholder="Current Team/Club/School"
              value={formData.currentTeam}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>
        </div>

        {/* Career Stats */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Career Statistics
          </h2>
          <textarea
            name="careerStats"
            placeholder="Key Career Statistics..."
            value={formData.careerStats}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full h-28"
          ></textarea>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Skills & Attributes (Separated by commas)
          </h2>
          <textarea
            name="skills"
            placeholder="E.g., Speed, Agility, Leadership..."
            value={formData.skills}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full h-24"
          ></textarea>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Achievements (Separated by commas)
          </h2>
          <textarea
            name="achievements"
            placeholder="E.g., Certificates, medals, prizes or honours..."
            value={formData.achievements}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full h-24"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Save Resume
          </button>
        </div>
      </form>
    </>
  );
};

export default SportsResume;
