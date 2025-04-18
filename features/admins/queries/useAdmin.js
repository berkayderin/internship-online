import { toast } from '@/hooks/use-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createAdmin, deleteAdmin, getAdmins, updateAdmin } from '../services/admin';

export const useAdmins = ({ search, page, limit } = {}) => {
  return useQuery({
    queryKey: ['admins', { search, page, limit }],
    queryFn: () => getAdmins({ search, page, limit }),
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['admins']);
      toast({
        title: 'Başarılı',
        description: 'Yönetici başarıyla oluşturuldu.',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Yönetici oluşturulurken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admins']);
      toast({
        title: 'Başarılı',
        description: 'Yönetici başarıyla güncellendi.',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Yönetici güncellenirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['admins']);
      toast({
        title: 'Başarılı',
        description: 'Yönetici başarıyla silindi.',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Yönetici silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};
