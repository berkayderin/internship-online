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

	getStudentActivities: async (studentId) => {
		try {
			if (!studentId) return null
			const response = await axios.get(
				`${STUDENTS_API_URL}/${studentId}`
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
