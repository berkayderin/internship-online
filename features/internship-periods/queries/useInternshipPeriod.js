// features/internship-periods/queries/useInternshipPeriod.js
import { toast } from '@/hooks/use-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { internshipPeriodService } from '../services/internshipPeriod';

export const useInternshipPeriods = () => {
  return useQuery({
    queryKey: ['internshipPeriods'],
    queryFn: internshipPeriodService.getPeriods,
  });
};

export const useCreateInternshipPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: internshipPeriodService.createPeriod,
    onSuccess: () => {
      queryClient.invalidateQueries(['internshipPeriods']);
      toast({
        title: 'Başarılı',
        description: 'Staj dönemi oluşturuldu.',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Staj dönemi oluşturulamadı.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteInternshipPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => internshipPeriodService.deletePeriod(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['internshipPeriods']);
      toast({
        title: 'Başarılı',
        description: 'Staj dönemi silindi.',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Staj dönemi silinemedi.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateInternshipPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => internshipPeriodService.updatePeriod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['internshipPeriods']);
      toast({
        title: 'Başarılı',
        description: 'Staj dönemi güncellendi.',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Staj dönemi güncellenemedi.',
        variant: 'destructive',
      });
    },
  });
};
