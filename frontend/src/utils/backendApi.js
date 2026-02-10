import axios from 'axios';

// Create an axios instance with default config
const backendApi = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend runs on different port/url
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the auth token
backendApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors (like 401)
backendApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            // For now, we just reject the promise, but you might want to dispatch a logout action
            console.error('Unauthorized access. Redirecting to login...');
            // window.location.href = '/login'; // Optional: auto-redirect
        }
        return Promise.reject(error);
    }
);

export default backendApi;
