// features/internship-periods/services/internshipPeriod.js
import axios from 'axios';

const API_URL = '/api/internship-periods';

export const internshipPeriodService = {
  createPeriod: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },

  getPeriods: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },

  deletePeriod: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },

  updatePeriod: async (id, data) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },

  getPeriod: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error.message);
      throw error;
    }
  },
};
