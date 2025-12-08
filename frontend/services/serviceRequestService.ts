import { api } from '@/lib/api';
import { ServiceRequest } from '@/types';

export const serviceRequestService = {
  async createServiceRequest(data: {
    serviceType: string;
    dateFrom: Date | string;
    dateTo: Date | string;
    duration: string;
    typeOfService: string;
    type: string;
    category: string;
    subcategory: string;
    description: string;
    priority: string;
  }) {
    return await api.post<ServiceRequest>('/service-requests', data);
  },

  async getServiceRequests(params?: {
    status?: string;
    priority?: string;
    type?: string;
    serviceType?: string;
    category?: string;
    my?: boolean;
    assignedTo?: string;
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
    return await api.get<ServiceRequest[]>(`/service-requests${query ? `?${query}` : ''}`);
  },

  async getServiceRequestById(id: string) {
    return await api.get<ServiceRequest>(`/service-requests/${id}`);
  },

  async updateServiceRequest(id: string, data: Partial<ServiceRequest>) {
    return await api.patch<ServiceRequest>(`/service-requests/${id}`, data);
  },

  async approveServiceRequest(id: string) {
    return await api.post<ServiceRequest>(`/service-requests/${id}/approve`);
  },

  async rejectServiceRequest(id: string) {
    return await api.post<ServiceRequest>(`/service-requests/${id}/reject`);
  },

  async addComment(id: string, text: string) {
    return await api.post<ServiceRequest>(`/service-requests/${id}/comments`, { text });
  },

  async assignServiceRequest(id: string, agentId: string) {
    return await api.patch<ServiceRequest>(`/service-requests/${id}/assign`, { agentId });
  },

  async getStats() {
    return await api.get('/service-requests/stats');
  },
};
