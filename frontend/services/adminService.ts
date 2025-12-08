import { api } from '@/lib/api';
import { User, Category, Analytics } from '@/types';

export const adminService = {
  // User management
  async getUsers(params?: { role?: string; isActive?: boolean }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return await api.get<User[]>(`/admin/users${query ? `?${query}` : ''}`);
  },

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
  }) {
    return await api.post<User>('/admin/users', data);
  },

  async updateUser(id: string, data: Partial<User>) {
    return await api.patch<User>(`/admin/users/${id}`, data);
  },

  async deactivateUser(id: string) {
    return await api.patch<User>(`/admin/users/${id}/deactivate`);
  },

  async activateUser(id: string) {
    return await api.patch<User>(`/admin/users/${id}/activate`);
  },

  // Category management
  async getCategories(type?: string) {
    return await api.get<Category[]>(`/admin/categories${type ? `?type=${type}` : ''}`);
  },

  async createCategory(data: {
    name: string;
    type: string;
    subcategories?: string[];
  }) {
    return await api.post<Category>('/admin/categories', data);
  },

  async updateCategory(id: string, data: Partial<Category>) {
    return await api.patch<Category>(`/admin/categories/${id}`, data);
  },

  async deleteCategory(id: string) {
    return await api.delete(`/admin/categories/${id}`);
  },

  // Analytics
  async getAnalytics() {
    return await api.get<Analytics>('/admin/analytics');
  },
};
