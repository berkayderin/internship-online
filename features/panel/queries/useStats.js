import { useQuery } from '@tanstack/react-query';

import { getApplicationStats, getStudentStats } from '../services/stats';

export function useApplicationStats() {
  return useQuery({
    queryKey: ['applicationStats'],
    queryFn: getApplicationStats,
  });
}

export function useStudentStats() {
  return useQuery({
    queryKey: ['studentStats'],
    queryFn: getStudentStats,
  });
}
