import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => api.searchMemories(query),
    enabled: !!query && query.length > 2,
  });
}
