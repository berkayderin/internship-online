// features/daily-activities/services/dailyActivity.js
import axios from 'axios'

const API_URL = '/api/daily-activities'

export const dailyActivityService = {
	createActivity: async (data) => {
		try {
			const response = await axios.post(API_URL, {
				date: data.date,
				content: data.content
			})
			return response.data
		} catch (error) {
			console.error(
				'Service error:',
				error.response?.data || error.message
			)
			throw error
		}
	},

	updateActivity: async (id, data) => {
		try {
			const response = await axios.patch(`${API_URL}/${id}`, {
				date: data.date,
				content: data.content
			})
			return response.data
		} catch (error) {
			console.error(
				'Service error:',
				error.response?.data || error.message
			)
			throw error
		}
	},

	submitFeedback: async (id, data) => {
		try {
			const response = await axios.patch(`${API_URL}/${id}`, {
				status: data.status,
				feedback: data.feedback
			})
			return response.data
		} catch (error) {
			console.error(
				'Service error:',
				error.response?.data || error.message
			)
			throw error
		}
	},

	getActivities: async (params = {}) => {
		try {
			const queryString = new URLSearchParams({
				...(params.page && { page: params.page }),
				...(params.limit && { limit: params.limit }),
				...(params.startDate && { startDate: params.startDate }),
				...(params.endDate && { endDate: params.endDate }),
				...(params.status && { status: params.status })
			}).toString()

			const response = await axios.get(
				`${API_URL}${queryString ? `?${queryString}` : ''}`
			)
			return response.data
		} catch (error) {
			console.error(
				'Service error:',
				error.response?.data || error.message
			)
			throw error
		}
	},

	isActive: async () => {
		try {
			const response = await axios.get(
				'/api/internship-periods/is-active'
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
