// features/student-activities/services/student.js
import axios from 'axios'

const STUDENTS_API_URL = '/api/students'

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
			const queryParams = {
				page: params.page,
				limit: params.limit,
				status: params.status,
				search: params.search
			}

			if (studentId) {
				const [studentResponse, activitiesResponse] =
					await Promise.all([
						axios.get(`${STUDENTS_API_URL}/${studentId}`),
						axios.get(`${STUDENTS_API_URL}/${studentId}/activities`, {
							params: queryParams
						})
					])

				return {
					student: studentResponse.data,
					...activitiesResponse.data
				}
			} else {
				const response = await axios.get('/api/daily-activities', {
					params: queryParams
				})

				console.log('Tüm aktiviteler response:', response.data)

				return {
					student: null,
					...response.data
				}
			}
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
				`/api/daily-activities/${id}`,
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
