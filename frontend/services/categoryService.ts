import { api } from '@/lib/api';

export interface Category {
  _id: string;
  name: string;
  type: string;
  subcategories: string[];
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  async getCategories(params?: { type?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.type) {
      queryParams.append('type', params.type);
    }
    const query = queryParams.toString();
    return await api.get<Category[]>(`/tickets/categories${query ? `?${query}` : ''}`);
  },

  async getCategory(id: string) {
    return await api.get<Category>(`/admin/categories/${id}`);
  },

  async createCategory(data: {
    name: string;
    type: string;
    subcategories: string[];
  }) {
    return await api.post<Category>('/admin/categories', data);
  },

  async updateCategory(id: string, data: Partial<Category>) {
    return await api.patch<Category>(`/admin/categories/${id}`, data);
  },

  async deleteCategory(id: string) {
    return await api.delete(`/admin/categories/${id}`);
  },
};
