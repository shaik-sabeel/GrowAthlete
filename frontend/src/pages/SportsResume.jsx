import React from "react";

const SportsResume = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="py-10 text-3xl font-bold text-center text-indigo-600 mb-8">
        Sports Resume
      </h1>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Photo</span>
            </div>
            <button className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
              Upload Photo
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-1">
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="date"
              placeholder="Date of Birth"
              className="border rounded-lg px-3 py-2 w-full"
            />
            <select className="border rounded-lg px-3 py-2 w-full">
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <input
              type="text"
              placeholder="Nationality"
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Phone Number"
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
          <select className="border rounded-lg px-3 py-2 w-full">
            <option>Select Sport</option>
            <option>Cricket</option>
            <option>Football</option>
            <option>Basketball</option>
          </select>
          <input
            type="text"
            placeholder="Position / Specialization"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Height (cm)"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <select className="border rounded-lg px-3 py-2 w-full">
            <option>Dominant Hand/Foot</option>
            <option>Left</option>
            <option>Right</option>
          </select>
          <input
            type="text"
            placeholder="Current Team/Club/School"
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
          placeholder="Key Career Statistics..."
          className="border rounded-lg px-3 py-2 w-full h-28"
        ></textarea>
      </div>

      {/* Skills & Attributes */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
          Skills & Attributes
        </h2>
        <textarea
          placeholder="E.g., Speed, Agility, Leadership..."
          className="border rounded-lg px-3 py-2 w-full h-24"
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
          Cancel
        </button>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Save Resume
        </button>
      </div>
    </div>
  );
}

export default SportsResume;
