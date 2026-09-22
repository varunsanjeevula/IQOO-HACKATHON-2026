import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useReminders() {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: () => api.getReminders(),
  });
}
