import axios from 'axios';
import { mockBackend } from '../utils/mockBackend';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

let accessToken = localStorage.getItem('cultivate_token') || null;

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 5000,
});

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('cultivate_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('cultivate_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

if (accessToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

api.interceptors.request.use((config) => {
  if (accessToken && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Fallback resolver when backend is offline or unreachable
const handleOfflineFallback = (error) => {
  const url = error.config?.url || '';
  const method = (error.config?.method || 'get').toLowerCase();

  const isNetworkFailure =
    !error.response ||
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED' ||
    error.response?.status >= 500 ||
    error.response?.status === 404;

  if (isNetworkFailure) {
    console.warn(`[Cultivate Engine] Backend offline (${url}). Using resilient client engine.`);

    // 1. Auth endpoints
    if (url.includes('/auth/signup') || url.includes('/auth/login')) {
      const body = JSON.parse(error.config?.data || '{}');
      const mockUser = {
        id: 'usr_guest_' + Date.now(),
        displayName: body.displayName || (body.email ? body.email.split('@')[0] : 'Master Gardener'),
        email: body.email || 'gardener@cultivate.app',
      };
      const mockToken = 'jwt_token_' + Date.now();
      localStorage.setItem('cultivate_user', JSON.stringify(mockUser));
      setAccessToken(mockToken);
      return Promise.resolve({ data: { user: mockUser, accessToken: mockToken }, status: 200 });
    }

    if (url.includes('/auth/me')) {
      const savedUser = localStorage.getItem('cultivate_user');
      const user = savedUser ? JSON.parse(savedUser) : {
        id: 'usr_guest',
        displayName: 'Master Gardener',
        email: 'gardener@cultivate.app',
      };
      return Promise.resolve({ data: { user }, status: 200 });
    }

    if (url.includes('/auth/refresh')) {
      return Promise.resolve({ data: { accessToken: 'jwt_token_refreshed' }, status: 200 });
    }

    if (url.includes('/auth/logout')) {
      localStorage.removeItem('cultivate_user');
      setAccessToken(null);
      return Promise.resolve({ data: { message: 'Logged out' }, status: 200 });
    }

    // 2. Garden endpoints
    if (url.endsWith('/garden') && method === 'get') {
      return Promise.resolve({ data: mockBackend.getGarden(), status: 200 });
    }

    if (url.includes('/garden/log') && method === 'get') {
      return Promise.resolve({ data: mockBackend.getGrowthLog(), status: 200 });
    }

    // 3. Task endpoints
    if (url.endsWith('/tasks') && method === 'get') {
      return Promise.resolve({ data: mockBackend.getTasks(), status: 200 });
    }

    if (url.endsWith('/tasks') && method === 'post') {
      const body = JSON.parse(error.config?.data || '{}');
      const newTask = mockBackend.createTask(body);
      return Promise.resolve({ data: newTask, status: 201 });
    }

    if (url.includes('/tasks/') && url.includes('/complete') && method === 'post') {
      const match = url.match(/\/tasks\/([^/]+)\/complete/);
      const id = match ? match[1] : '';
      const result = mockBackend.completeTask(id);
      return Promise.resolve({ data: result, status: 200 });
    }

    // 4. Shop endpoints
    if (url.endsWith('/shop') && method === 'get') {
      return Promise.resolve({ data: mockBackend.getShop(), status: 200 });
    }

    if (url.includes('/shop/purchase/') && method === 'post') {
      const match = url.match(/\/shop\/purchase\/([^/]+)/);
      const id = match ? match[1] : '';
      try {
        const result = mockBackend.purchaseItem(id);
        return Promise.resolve({ data: result, status: 200 });
      } catch (err) {
        return Promise.reject({ response: { data: { error: err.message } } });
      }
    }
  }

  return Promise.reject(error);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true, timeout: 3000 }
        );
        if (res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return handleOfflineFallback(error);
  }
);

export default api;
