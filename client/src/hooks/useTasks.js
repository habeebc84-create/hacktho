import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';

export function useTasks() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks');
      return data;
    },
  });

  const createTask = useMutation({
    mutationFn: (newTask) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const completeTask = useMutation({
    mutationFn: (id) => api.post(`/tasks/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['garden'] });
    },
  });

  return { tasksQuery, createTask, completeTask };
}
