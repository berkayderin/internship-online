// features/student-activities/queries/useStudentQueries.js
import {
	useQuery,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { studentService } from '../services/student'

export function useStudents() {
	return useQuery({
		queryKey: ['students'],
		queryFn: () => studentService.getStudents()
	})
}

export function useStudentActivities(studentId, params) {
	return useQuery({
		queryKey: ['student-activities', studentId, params],
		queryFn: () =>
			studentService.getStudentActivities(studentId, params),
		enabled: true
	})
}

export function useSubmitFeedback() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }) =>
			studentService.submitFeedback(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['student-activities']
			})
		}
	})
}
