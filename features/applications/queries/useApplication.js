// features/applications/queries/useApplication.js
import {
	useMutation,
	useQueryClient,
	useQuery
} from '@tanstack/react-query'
import { applicationService } from '../services/application'
import { toast } from '@/hooks/use-toast'

export const useCreateApplication = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: applicationService.createApplication,
		onSuccess: () => {
			queryClient.invalidateQueries(['applications'])
			toast({
				title: 'Başarılı',
				description: 'Başvurunuz başarıyla gönderildi.'
			})
		},
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Başvuru gönderilemedi.',
				variant: 'destructive'
			})
		}
	})
}

export const useApplications = () => {
	return useQuery({
		queryKey: ['applications'],
		queryFn: applicationService.getApplications
	})
}

export const useUpdateApplication = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }) =>
			applicationService.updateApplication(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['applications'])
			toast({
				title: 'Başarılı',
				description: 'Başvuru durumu güncellendi.'
			})
		},
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Başvuru güncellenemedi.',
				variant: 'destructive'
			})
		}
	})
}

export const useBulkUpdateApplications = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ ids, data }) =>
			applicationService.updateApplicationsBulk(ids, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['applications'])
			toast({
				title: 'Başarılı',
				description: 'Seçili başvurular güncellendi.'
			})
		},
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Başvurular güncellenirken hata oluştu.',
				variant: 'destructive'
			})
		}
	})
}
