import {
	useQuery,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import {
	getPublicHolidays,
	updatePublicHoliday
} from '../services/publicHoliday'
import { toast } from '@/hooks/use-toast'

export const usePublicHolidays = () => {
	return useQuery({
		queryKey: ['public-holidays'],
		queryFn: getPublicHolidays
	})
}

export const useUpdatePublicHoliday = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, ...values }) =>
			updatePublicHoliday(id, values),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['public-holidays'] })
			toast({
				title: 'Başarılı',
				description: 'Tatil günü güncellendi.'
			})
		}
	})
}
