import {
	useQuery,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import {
	getAdmins,
	createAdmin,
	updateAdmin,
	deleteAdmin
} from '../services/admin'

export const useAdmins = (search) => {
	return useQuery({
		queryKey: ['admins', search],
		queryFn: () => getAdmins(search)
	})
}

export const useCreateAdmin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createAdmin,
		onSuccess: () => {
			queryClient.invalidateQueries(['admins'])
			toast({
				title: 'Başarılı',
				description: 'Yönetici başarıyla oluşturuldu.'
			})
		},
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Yönetici oluşturulurken bir hata oluştu.',
				variant: 'destructive'
			})
		}
	})
}

export const useUpdateAdmin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }) => updateAdmin(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['admins'])
			toast({
				title: 'Başarılı',
				description: 'Yönetici başarıyla güncellendi.'
			})
		},
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Yönetici güncellenirken bir hata oluştu.',
				variant: 'destructive'
			})
		}
	})
}

export const useDeleteAdmin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteAdmin,
		onSuccess: () => {
			queryClient.invalidateQueries(['admins'])
			toast({
				title: 'Başarılı',
				description: 'Yönetici başarıyla silindi.'
			})
		},
		onError: () => {
			toast({
				title: 'Hata',
				description: 'Yönetici silinirken bir hata oluştu.',
				variant: 'destructive'
			})
		}
	})
}
