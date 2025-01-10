// features/applications/services/application.js
import axios from 'axios';

const API_URL = '/api/applications';

export const applicationService = {
  createApplication: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
  getApplications: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
  updateApplication: async (id, data) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
  updateApplicationsBulk: async (ids, data) => {
    try {
      const response = await axios.patch('/api/applications/bulk', {
        ids,
        ...data,
      });
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
  getInternshipPeriod: async (periodId) => {
    try {
      const response = await axios.get(`/api/internship-periods/${periodId}`);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
  deleteApplication: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
  updateApplicationByUser: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
  getPublicHolidays: async () => {
    try {
      const response = await axios.get('/api/public-holidays');
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
};
