import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => api.getInsights(),
  });
}
