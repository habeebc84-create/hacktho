import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';

export function useGarden() {
  return useQuery({
    queryKey: ['garden'],
    queryFn: async () => {
      const { data } = await api.get('/garden');
      return data;
    },
    staleTime: 60000,
  });
}
