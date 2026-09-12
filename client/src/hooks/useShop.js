import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import toast from 'react-hot-toast';

export function useShop() {
  const queryClient = useQueryClient();

  const shopQuery = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      const { data } = await api.get('/shop');
      return data;
    },
  });

  const purchaseItem = useMutation({
    mutationFn: (itemId) => api.post(`/shop/purchase/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      queryClient.invalidateQueries({ queryKey: ['garden'] });
      toast.success('Item purchased successfully!');
    },
    onError: () => {
      toast.error('Failed to purchase item. Check your nutrients.');
    }
  });

  return { shopQuery, purchaseItem };
}
