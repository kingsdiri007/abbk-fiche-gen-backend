
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Clients
export const getClients = () => api.get('/clients');
export const addClient = (data) => api.post('/clients', data);

// Formations
export const getFormations = (software) => 
  api.get('/formations', { params: { software } });
export const addFormation = (data) => api.post('/formations', data);

// PDFs
export const uploadPDF = (formData) => 
  api.post('/pdf/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getPDFs = () => api.get('/pdf');