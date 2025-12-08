import { api } from '@/lib/api';
import { User } from '@/types';

export const authService = {
  async login(email: string, password: string) {
    return await api.post<User>('/auth/login', { email, password });
  },

  async logout() {
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
