// This file intentionally wraps hot-toast or can just export config
import { toast } from 'react-hot-toast';

export const customToast = {
  success: (msg) => toast.success(msg, {
    style: {
      background: 'var(--moss)',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '16px'
    },
    icon: '🌱'
  }),
  error: (msg) => toast.error(msg, {
    style: {
      background: 'var(--soil)',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '16px'
    },
    icon: '❌'
  }),
  info: (msg) => toast(msg, {
    style: {
      background: 'var(--cream)',
      color: 'var(--forest)',
      border: '1px solid var(--moss)',
      fontWeight: 'bold',
      borderRadius: '16px'
    }
  })
};
