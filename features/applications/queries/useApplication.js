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
		onError: (error) => {
			if (error.response?.data?.error === 'Validation failed') {
				const hasDateError = error.response.data.errors?.some(
					(err) =>
						err.path[0] === 'internshipStartDate' ||
						err.path[0] === 'internshipEndDate'
				)

				if (hasDateError) {
					toast({
						title: 'Hata',
						description:
							'Staj başlangıç ve bitiş tarihi Fakülte tarafından belirlenen aralıkta değildir.',
						variant: 'destructive'
					})
					return
				}
			}

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
				description: 'Başvurunuz başarıyla güncellendi.'
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

export const useInternshipPeriod = (periodId) => {
	return useQuery({
		queryKey: ['internship-periods', periodId],
		queryFn: () => applicationService.getInternshipPeriod(periodId),
		enabled: !!periodId
	})
}
