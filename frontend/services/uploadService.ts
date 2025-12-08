import { api } from '@/lib/api';

export const uploadService = {
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<{ url: string; filename: string }>('/upload', formData);
    
    return response.data!;
  },

  async uploadMultiple(files: File[]): Promise<{ url: string; filename: string }[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    const response = await api.post<{ url: string; filename: string }[]>('/upload/multiple', formData);
    
    return response.data!;
  },
};
