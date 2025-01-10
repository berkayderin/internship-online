// features/student-activities/queries/useStudentQueries.js
import { toast } from '@/hooks/use-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { studentService } from '../services/student';

export function useStudents(params) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentService.getStudents(params),
  });
}

export function useStudentActivities(studentId, params) {
  return useQuery({
    queryKey: ['student-activities', studentId, params],
    queryFn: () => studentService.getStudentActivities(studentId, params),
    enabled: true,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => studentService.submitFeedback(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['student-activities'],
      });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId) => studentService.deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Öğrenci başarıyla silindi',
        description: 'Öğrencinin tüm aktiviteleri ve verileri silindi',
      });
    },
  });
}
