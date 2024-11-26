// features/student-activities/services/student.js
import axios from 'axios'

const STUDENTS_API_URL = '/api/students'
const DAILY_ACTIVITIES_API_URL = '/api/daily-activities'

export const studentService = {
	getStudents: async () => {
		try {
			const response = await axios.get(STUDENTS_API_URL)
			return response.data
		} catch (error) {
			console.error(
				'Service error:',
				error.response?.data || error.message
			)
			throw error
		}
	},

	getStudentActivities: async (studentId, params = {}) => {
		try {
			if (!studentId) return null

			const queryString = new URLSearchParams({
				...(params.page && { page: params.page }),
				...(params.limit && { limit: params.limit }),
				...(params.status &&
					params.status !== 'all' && { status: params.status }),
				...(params.search && { search: params.search }),
				...(params.startDate && { startDate: params.startDate }),
				...(params.endDate && { endDate: params.endDate })
			}).toString()

			const response = await axios.get(
				`${STUDENTS_API_URL}/${studentId}${
					queryString ? `?${queryString}` : ''
				}`
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

	submitFeedback: async (id, data) => {
		try {
			const response = await axios.patch(
				`${DAILY_ACTIVITIES_API_URL}/${id}`,
				{
					status: data.status,
					feedback: data.feedback
				}
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
