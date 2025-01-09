// features/student-activities/services/student.js
import axios from 'axios'

const STUDENTS_API_URL = '/api/students'

export const studentService = {
	getStudents: async (params = {}) => {
		try {
			const queryParams = {
				page: params.page,
				limit: params.limit,
				department: params.department
			}
			const response = await axios.get(STUDENTS_API_URL, {
				params: queryParams
			})
			return response.data
		} catch (error) {
			console.error(
				'Get students error:',
				error.response?.data || error.message
			)
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

				return {
					student: null,
					...response.data
				}
			}
		} catch (error) {
			console.error(
				'Get student activities error:',
				error.response?.data || error.message
			)
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
				'Submit feedback error:',
				error.response?.data || error.message
			)
		}
	},

	deleteStudent: async (studentId) => {
		try {
			const response = await axios.delete(
				`${STUDENTS_API_URL}/${studentId}`
			)
			return response.data
		} catch (error) {
			console.error(
				'Delete student error:',
				error.response?.data || error.message
			)
		}
	}
}
