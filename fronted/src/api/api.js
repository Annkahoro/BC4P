import axios from 'axios';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  if (url) {
    // Ensure URL ends with /api if not present
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  // Fallback for local development
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

console.log('API Base URL configured as:', getBaseURL());

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;
    
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (error.response.data && error.response.data.message === 'User recently changed password. Please log in again.') {
        // Dispatch custom event for password change logout
        window.dispatchEvent(new CustomEvent('auth:session-invalid'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
