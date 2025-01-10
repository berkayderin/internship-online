import axios from 'axios';

const API_URL = '/api/admins';

export const getAdmins = async ({ search, page, limit } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);

  const url = `${API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
  const { data } = await axios.get(url);
  return data;
};

export const createAdmin = async (values) => {
  const { data } = await axios.post(API_URL, values);
  return data;
};

export const updateAdmin = async (id, values) => {
  const { data } = await axios.patch(`${API_URL}/${id}`, values);
  return data;
};

export const deleteAdmin = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
