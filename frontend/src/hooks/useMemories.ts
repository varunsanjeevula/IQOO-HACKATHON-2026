import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useMemories() {
  return useQuery({
    queryKey: ['memories'],
    queryFn: () => api.getMemories(),
  });
}

export function useMemory(id: string) {
  return useQuery({
    queryKey: ['memory', id],
    queryFn: () => api.getMemory(id),
    enabled: !!id,
  });
}

export function useRelatedMemories(id: string) {
  return useQuery({
    queryKey: ['related-memories', id],
    queryFn: () => api.getRelatedMemories(id),
    enabled: !!id,
  });
}
