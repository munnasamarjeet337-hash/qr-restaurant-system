import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : (rawApiUrl === '/' ? '/api' : `${rawApiUrl.replace(/\/+$/, '')}/api`);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Request interceptor: inject Bearer token from localStorage if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resumeiq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauth
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup' && path !== '/verify-otp' && path !== '/') {
        // Clear expired token if unauthorized on protected routes
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
