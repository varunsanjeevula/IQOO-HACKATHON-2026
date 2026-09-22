import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

export function useChat() {
  return useMutation({
    mutationFn: (message: string) => api.sendMessage(message),
  });
}
