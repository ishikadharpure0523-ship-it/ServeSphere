import axios from 'axios';
import { firebaseAuth } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// Add auth token to all requests
api.interceptors.request.use(
  async (config) => {
    if (firebaseAuth.currentUser) {
      const token = await firebaseAuth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout here
      console.error('Authentication error:', error);
    }
    return Promise.reject(error);
  }
);

export const saveProfile = async (profileData) => {
  return api.post('/api/profile', profileData);
};

export const updateProfile = async (updates) => {
  return api.put('/api/profile', updates);
};

// Opportunities
export const getOpportunities = async (filters = {}) => {
  return api.get('/api/opportunities', { params: filters });
};

export const getOpportunity = async (id) => {
  return api.get(`/api/opportunities/${id}`);
};

export const createOpportunity = async (data) => {
  return api.post('/api/opportunities', data);
};

export const updateOpportunity = async (id, data) => {
  return api.put(`/api/opportunities/${id}`, data);
};

// Applications
export const getApplications = async () => {
  return api.get('/api/applications');
};

export const createApplication = async (data) => {
  return api.post('/api/applications', data);
};

export const updateApplication = async (id, data) => {
  return api.put(`/api/applications/${id}`, data);
};

// Certificates
export const getCertificates = async () => {
  return api.get('/api/certificates');
};

export const verifyCertificate = async (code) => {
  return api.get(`/api/certificates/${code}/verify`);
};

// Fund Requests
export const getFundRequests = async (filters = {}) => {
  return api.get('/api/fund-requests', { params: filters });
};

export const createFundRequest = async (data) => {
  return api.post('/api/fund-requests', data);
};

// Donations
export const getDonations = async () => {
  return api.get('/api/donations');
};

export const createDonation = async (data) => {
  return api.post('/api/donations', data);
};

// AI
export const generateDescription = async (data) => {
  return api.post('/api/ai/generate-description', data);
};

// Notifications
export const getNotifications = async () => {
  return api.get('/api/notifications');
};

export const markNotificationRead = async (id) => {
  return api.put(`/api/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
  return api.put('/api/notifications/mark-all-read');
};

// Stats
export const getVolunteerStats = async () => {
  return api.get('/api/stats/volunteer');
};

export const getNGOStats = async () => {
  return api.get('/api/stats/ngo');
};

export const getDonorStats = async () => {
  return api.get('/api/stats/donor');
};

export default api;