import { api } from '@/lib/api';
import { Ticket } from '@/types';

export const ticketService = {
  async createTicket(data: {
    type: string;
    category: string;
    subcategory: string;
    description: string;
    priority: string;
    attachments?: string[];
  }) {
    return await api.post<Ticket>('/tickets', data);
  },

  async getTickets(params?: {
    status?: string;
    priority?: string;
    type?: string;
    category?: string;
    my?: boolean;
    assignedTo?: string;
    page?: number;
    limit?: number;
    search?: string;
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
    return await api.get<Ticket[]>(`/tickets${query ? `?${query}` : ''}`);
  },

  async getTicket(id: string) {
    return await api.get<Ticket>(`/tickets/${id}`);
  },

  async getTicketById(id: string) {
    return await api.get<Ticket>(`/tickets/${id}`);
  },

  async updateTicket(id: string, data: Partial<Ticket>) {
    return await api.patch<Ticket>(`/tickets/${id}`, data);
  },

  async addComment(id: string, text: string, attachments?: string[]) {
    return await api.post<Ticket>(`/tickets/${id}/comments`, { text, attachments });
  },

  async assignTicket(id: string, agentId: string) {
    return await api.patch<Ticket>(`/tickets/${id}/assign`, { agentId });
  },

  async getStats() {
    return await api.get('/tickets/stats');
  },

  async markAsResolved(id: string) {
    return await api.patch<Ticket>(`/tickets/${id}/resolve`, {});
  },
};
