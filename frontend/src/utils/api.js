import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://growathlete-1.onrender.com/api",
  withCredentials: true,
});

// Export the base URL for use in other components
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://growathlete-1.onrender.com";

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
