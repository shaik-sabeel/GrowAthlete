import axios from "axios";

const api = axios.create({
  // Use local backend by default in development; override with VITE_API_BASE_URL in prod
  baseURL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api",
  withCredentials: true,
});

// Export the base URL for use in other components
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

// Use real API now that backend is working
export default api;
