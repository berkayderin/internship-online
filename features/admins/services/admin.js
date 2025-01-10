import axios from 'axios'

const API_URL = '/api/admins'

export const getAdmins = async () => {
	const { data } = await axios.get(API_URL)
	return data
}

export const createAdmin = async (values) => {
	const { data } = await axios.post(API_URL, values)
	return data
}

export const updateAdmin = async (id, values) => {
	const { data } = await axios.patch(`${API_URL}/${id}`, values)
	return data
}

export const deleteAdmin = async (id) => {
	await axios.delete(`${API_URL}/${id}`)
}
