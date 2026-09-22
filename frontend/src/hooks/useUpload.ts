import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useUpload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => api.uploadMemory(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}
