import axios from 'axios';

let accessToken = localStorage.getItem('cultivate_token') || null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
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
          { withCredentials: true }
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
    return Promise.reject(error);
  }
);

export default api;
