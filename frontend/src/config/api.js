// API Configuration for different environments
const API_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:5000'
  },
  production: {
    BASE_URL: import.meta.env.VITE_API_URL || 'https://your-render-app.onrender.com'
  }
};

const environment = import.meta.env.MODE || 'development';

export const API_BASE_URL = API_CONFIG[environment].BASE_URL;

export const API_ENDPOINTS = {
  CONTACT: '/api/contact'
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
