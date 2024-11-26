// queries/dailyActivityQueries.js
import { toast } from '@/hooks/use-toast'
import { dailyActivityService } from '@/features/daily-activities/services/dailyActivity'
import {
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'

export const useCreateActivity = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: dailyActivityService.createActivity,
		onSuccess: () => {
			queryClient.invalidateQueries(['dailyActivities'])
			toast({
				title: 'Başarılı',
				description: 'Günlük aktivite kaydedildi.'
			})
		},
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Aktivite kaydedilemedi.',
				variant: 'destructive'
			})
		}
	})
}

export const useGetActivities = (params) => {
	return useQuery({
		queryKey: ['dailyActivities', params],
		queryFn: () => dailyActivityService.getActivities(params),
		keepPreviousData: true
	})
}

export const useUpdateActivity = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }) =>
			dailyActivityService.updateActivity(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['dailyActivities'])
			toast({
				title: 'Başarılı',
				description: 'Aktivite güncellendi.'
			})
		}
	})
}

export const useSubmitFeedback = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }) =>
			dailyActivityService.submitFeedback(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['dailyActivities'])
			toast({
				title: 'Başarılı',
				description: 'Geri bildirim kaydedildi.'
			})
		}
	})
}
