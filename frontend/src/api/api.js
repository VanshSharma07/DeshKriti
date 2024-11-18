import axios from "axios";

const local = 'http://localhost:5000';
const production = '';

const api = axios.create({
    baseURL: `${local}/api`,
    withCredentials: true // Add this to send cookies
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

export default api;