import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MyRegistrations from '../components/MyRegistrations';

const UserDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/auth/profile");
        setData(res.data.user);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-25">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data ? `Welcome back, ${data.username}!` : "Loading profile..."}
        </h1>
        <p className="text-gray-600">Manage your profile and view your upcoming events.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <MyRegistrations />
      </div>
    </div>
  );
};

export default UserDashboard;
