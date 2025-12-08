import { ITicket } from '../models/Ticket.model';
export declare const createTicket: (userId: string, data: {
    type: string;
    category: string;
    subcategory: string;
    description: string;
    priority: string;
    attachments?: string[];
}) => Promise<ITicket>;
export declare const getTicketById: (ticketId: string, userId?: string, userRole?: string) => Promise<ITicket | null>;
export declare const getTicketByTicketId: (ticketId: string) => Promise<ITicket | null>;
export declare const getUserTickets: (userId: string, filters?: any, skip?: number, limit?: number, sort?: any) => Promise<ITicket[]>;
export declare const countUserTickets: (userId: string, filters?: any) => Promise<number>;
export declare const getAssignedTickets: (agentId: string, filters?: any, skip?: number, limit?: number, sort?: any) => Promise<ITicket[]>;
export declare const countAssignedTickets: (agentId: string, filters?: any) => Promise<number>;
export declare const getAllTickets: (filters?: any, skip?: number, limit?: number, sort?: any) => Promise<ITicket[]>;
export declare const countAllTickets: (filters?: any) => Promise<number>;
export declare const updateTicket: (ticketId: string, updates: Partial<ITicket>, userId: string, userRole?: string) => Promise<ITicket | null>;
export declare const addComment: (ticketId: string, userId: string, text: string, attachments?: string[], userRole?: string) => Promise<ITicket | null>;
export declare const assignTicket: (ticketId: string, agentId: string, assignedBy: string) => Promise<ITicket | null>;
export declare const getTicketStats: () => Promise<any>;
export declare const markAsResolved: (ticketId: string, userId: string) => Promise<ITicket | null>;
export declare const ticketService: {
    createTicket: (userId: string, data: {
        type: string;
        category: string;
        subcategory: string;
        description: string;
        priority: string;
        attachments?: string[];
    }) => Promise<ITicket>;
    getTicketById: (ticketId: string, userId?: string, userRole?: string) => Promise<ITicket | null>;
    getTicketByTicketId: (ticketId: string) => Promise<ITicket | null>;
    getUserTickets: (userId: string, filters?: any, skip?: number, limit?: number, sort?: any) => Promise<ITicket[]>;
    countUserTickets: (userId: string, filters?: any) => Promise<number>;
    getAssignedTickets: (agentId: string, filters?: any, skip?: number, limit?: number, sort?: any) => Promise<ITicket[]>;
    countAssignedTickets: (agentId: string, filters?: any) => Promise<number>;
    getAllTickets: (filters?: any, skip?: number, limit?: number, sort?: any) => Promise<ITicket[]>;
    countAllTickets: (filters?: any) => Promise<number>;
    updateTicket: (ticketId: string, updates: Partial<ITicket>, userId: string, userRole?: string) => Promise<ITicket | null>;
    addComment: (ticketId: string, userId: string, text: string, attachments?: string[], userRole?: string) => Promise<ITicket | null>;
    assignTicket: (ticketId: string, agentId: string, assignedBy: string) => Promise<ITicket | null>;
    getTicketStats: () => Promise<any>;
    markAsResolved: (ticketId: string, userId: string) => Promise<ITicket | null>;
};
//# sourceMappingURL=ticket.service.d.ts.map