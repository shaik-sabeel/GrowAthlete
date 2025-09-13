import axios from "axios";
import mockApi from "./mockApi.js";

// Check if backend is available
const isBackendAvailable = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL || "https://growathlete-1.onrender.com");
    return response.ok;
  } catch (error) {
    return false;
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://growathlete-1.onrender.com/api",
  withCredentials: true,
});

// Export the base URL for use in other components
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://growathlete-1.onrender.com";

// Enhanced API with fallback to mock
const enhancedApi = {
  post: async (url, data) => {
    try {
      return await api.post(url, data);
    } catch (error) {
      console.warn('Backend unavailable, using mock API:', error.message);
      return await mockApi.post(url, data);
    }
  },
  
  get: async (url) => {
    try {
      return await api.get(url);
    } catch (error) {
      console.warn('Backend unavailable, using mock API:', error.message);
      return await mockApi.get(url);
    }
  }
};

export default enhancedApi;

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
