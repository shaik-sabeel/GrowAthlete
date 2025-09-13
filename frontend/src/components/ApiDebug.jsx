import React from 'react';
import api from '../utils/api';

const ApiDebug = () => {
  const testApi = async () => {
    try {
      console.log('API Base URL:', api.defaults.baseURL);
      console.log('Environment VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
      
      const response = await api.get('/test');
      console.log('Test response:', response.data);
    } catch (error) {
      console.error('API Test Error:', error.message);
      console.error('Full error:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h3>API Debug</h3>
      <p>Base URL: {api.defaults.baseURL}</p>
      <p>Env VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL}</p>
      <button onClick={testApi} className="bg-blue-500 px-4 py-2 rounded">
        Test API
      </button>
    </div>
  );
};

export default ApiDebug;
