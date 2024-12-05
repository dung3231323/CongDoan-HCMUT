import httpClient from './httpClient';
import { setItem, removeItem, getItem } from '@/helpers/localStorage';

export type LoginDataResponse = {
  msg: string;
  data: LoginData;
};

export type LoginData = {
  token: string;
  user: {
    id: string;
    email: string;
    familyName: string | null;
    givenName: string | null;
    role: 'ADMIN' | 'MODERATOR';
    unionDeptId: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export const AUTH_KEY = 'auth';

const AuthService = {
  loginWithCode: async (code: string) => {
    const resp = await httpClient.get<LoginDataResponse>('/auth/google/redirect', {
      params: { code },
    });
    const { data, status } = resp;
    if (data.msg == 'Success') {
      const loginData = data.data;
      setItem(AUTH_KEY, loginData, true);
    }
    return { data, status };
  },
  logout: () => {
    removeItem(AUTH_KEY);
    window.location.href = '/login';
  },
  getUser: () => {
    const data = getItem<LoginData>(AUTH_KEY);
    return data?.user;
  },
};

export default AuthService;
