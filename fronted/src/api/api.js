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

export default api;
