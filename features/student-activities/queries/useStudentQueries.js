// features/student-activities/queries/useStudentQueries.js
import {
	useQuery,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { studentService } from '../services/student'
import { toast } from '@/hooks/use-toast'

export const useStudents = () => {
	return useQuery({
		queryKey: ['students'],
		queryFn: studentService.getStudents,
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Öğrenci listesi alınamadı.',
				variant: 'destructive'
			})
		}
	})
}

export const useStudentActivities = (studentId, params) => {
	return useQuery({
		queryKey: ['studentActivities', studentId, params],
		queryFn: () =>
			studentService.getStudentActivities(studentId, params),
		enabled: !!studentId,
		keepPreviousData: true,
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Aktivite listesi alınamadı.',
				variant: 'destructive'
			})
		}
	})
}

export const useSubmitFeedback = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }) =>
			studentService.submitFeedback(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['studentActivities'])
			toast({
				title: 'Başarılı',
				description: 'Geri bildirim kaydedildi.'
			})
		},
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Geri bildirim kaydedilemedi.',
				variant: 'destructive'
			})
		}
	})
}
