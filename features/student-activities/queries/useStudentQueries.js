import { useQuery } from '@tanstack/react-query'
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

export const useStudentActivities = (studentId) => {
	return useQuery({
		queryKey: ['studentActivities', studentId],
		queryFn: () => studentService.getStudentActivities(studentId),
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
