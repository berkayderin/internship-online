import axios from 'axios';

const API_URL = '/api/public-holidays';

export const getPublicHolidays = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const updatePublicHoliday = async (id, values) => {
  const { data } = await axios.patch(`${API_URL}/${id}`, values);
  return data;
};
