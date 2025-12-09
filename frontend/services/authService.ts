import { api, tokenManager } from '@/lib/api';
import { User } from '@/types';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
    if (response.data?.token) {
      tokenManager.setToken(response.data.token);
    }
    return response;
  },

  async logout() {
    tokenManager.removeToken();
    return await api.post('/auth/logout');
  },

  async getMe() {
    return await api.get<User>('/auth/me');
  },

  async updateProfile(data: { name: string }) {
    return await api.patch<User>('/auth/profile', data);
  },

  async updatePassword(data: { currentPassword: string; newPassword: string }) {
    return await api.patch('/auth/password', data);
  },
};
