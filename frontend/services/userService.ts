import { api } from '@/lib/api';

export const userService = {
  async getAgents() {
    return await api.get('/admin/users/agents');
  },

  async getUsers(params?: {
    role?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return await api.get(`/users${query ? `?${query}` : ''}`);
  },

  async updateUser(id: string, data: any) {
    return await api.patch(`/users/${id}`, data);
  },

  async deleteUser(id: string) {
    return await api.delete(`/users/${id}`);
  },
};
