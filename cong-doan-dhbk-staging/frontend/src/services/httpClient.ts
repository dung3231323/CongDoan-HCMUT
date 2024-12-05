import axios from 'axios';
import { config } from '@/config';
import { getItem, removeItem } from '@/helpers/localStorage';
import { AUTH_KEY, type LoginData } from './auth';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: config.api.url,
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// timeout for each response is 5 seconds
axiosClient.defaults.timeout = 10000;

axiosClient.interceptors.request.use((config) => {
  const data = getItem<LoginData>(AUTH_KEY);
  config.headers.Authorization = data ? `Bearer ${data.token}` : '';
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = `${config.client.url}/login`;
      }
      removeItem(AUTH_KEY);
      toast.warn('Bạn vui lòng đăng nhập!');
      return Promise.resolve(error.response);
    }
    if (status === 403) {
      if (window.location.pathname !== '/login') {
        window.location.href = `${config.client.url}/login`;
      }
      toast.error('Bạn không có quyền truy cập trang này!');
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
