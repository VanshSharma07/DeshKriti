import axios from "axios";

const getBaseUrl = () => {
  // For local development on same machine
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  // For local network access (mobile testing)
  return 'http://192.168.29.10:5000';
};

const local = getBaseUrl();
const production = '';

const api = axios.create({
    baseURL: `${local}/api`,
    withCredentials: true,
    timeout: 5000, // 5 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to handle authorization
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('customerToken') || localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;