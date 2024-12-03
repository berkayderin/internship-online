// features/applications/services/application.js
import axios from 'axios'

const API_URL = '/api/applications'

export const applicationService = {
	createApplication: async (data) => {
		try {
			const response = await axios.post(API_URL, data)
			return response.data
		} catch (error) {
			console.error(
				'Service error:',
				error.response?.data || error.message
			)
			throw error
		}
	},
	getApplications: async () => {
		try {
			const response = await axios.get(API_URL)
			return response.data
		} catch (error) {
			console.error(
				'Service error:',
				error.response?.data || error.message
			)
			throw error
		}
	},
	updateApplication: async (id, data) => {
		try {
			const response = await axios.patch(
				`/api/applications/${id}`,
				data
			)
			return response.data
		} catch (error) {
			console.error(
				'Service error:',
				error.response?.data || error.message
			)
			throw error
		}
	}
}
