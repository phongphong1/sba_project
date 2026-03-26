import axios from 'axios';
import { AUTH_TOKEN_KEY } from '../constants/auth';
import { disconnectRealtimeClient } from '@/lib/realtime/stompClient'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'content-type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
}, (error) => {
  const { status } = error.response || {};

  if (status === 401) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    void disconnectRealtimeClient();
    window.location.href = '/login';
  }

  if (status === 403) {
    console.error('You do not have permission to access this feature!');
  }

  return Promise.reject(error);
});

export default axiosClient;
