import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Cycle API calls
export const getCycles = () => 
  axios.get(`${API_URL}/cycles`, getAuthHeaders());

export const createCycle = (cycleData) =>
  axios.post(`${API_URL}/cycles`, cycleData, getAuthHeaders());

export const updateCycle = (id, cycleData) =>
  axios.put(`${API_URL}/cycles/${id}`, cycleData, getAuthHeaders());

export const deleteCycle = (id) =>
  axios.delete(`${API_URL}/cycles/${id}`, getAuthHeaders());

export const getPrediction = () =>
  axios.get(`${API_URL}/cycles/predict`, getAuthHeaders());

// Profile API calls
export const getProfile = () =>
  axios.get(`${API_URL}/profile`, getAuthHeaders());

export const updateProfile = (profileData) =>
  axios.put(`${API_URL}/profile`, profileData, getAuthHeaders());

export const updatePassword = (passwordData) =>
  axios.put(`${API_URL}/profile/password`, passwordData, getAuthHeaders());

export const deleteAccount = () =>
  axios.delete(`${API_URL}/profile`, getAuthHeaders());