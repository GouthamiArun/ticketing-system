import { ITicket } from '../models/Ticket.model';
import { FilterQuery } from 'mongoose';
export declare const findByTicketId: (ticketId: string) => Promise<ITicket | null>;
export declare const findByUser: (userId: string, options?: any) => Promise<ITicket[]>;
export declare const findByAssignedAgent: (agentId: string, options?: any) => Promise<ITicket[]>;
export declare const findWithFilters: (filters: {
    status?: string | string[];
    priority?: string | string[];
    type?: string;
    category?: string;
    createdBy?: string;
    assignedTo?: string;
    dateFrom?: Date;
    dateTo?: Date;
}, options?: any) => Promise<ITicket[]>;
export declare const addComment: (ticketId: string, comment: {
    user: string;
    userName: string;
    text: string;
    attachments?: string[];
}) => Promise<ITicket | null>;
export declare const assignAgent: (ticketId: string, agentId: string) => Promise<ITicket | null>;
export declare const updateStatus: (ticketId: string, status: string) => Promise<ITicket | null>;
export declare const getStatsByStatus: () => Promise<any[]>;
export declare const getStatsByPriority: () => Promise<any[]>;
export declare const ticketDAO: {
    findByTicketId: (ticketId: string) => Promise<ITicket | null>;
    findByUser: (userId: string, options?: any) => Promise<ITicket[]>;
    findByAssignedAgent: (agentId: string, options?: any) => Promise<ITicket[]>;
    findWithFilters: (filters: {
        status?: string | string[];
        priority?: string | string[];
        type?: string;
        category?: string;
        createdBy?: string;
        assignedTo?: string;
        dateFrom?: Date;
        dateTo?: Date;
    }, options?: any) => Promise<ITicket[]>;
    addComment: (ticketId: string, comment: {
        user: string;
        userName: string;
        text: string;
        attachments?: string[];
    }) => Promise<ITicket | null>;
    assignAgent: (ticketId: string, agentId: string) => Promise<ITicket | null>;
    updateStatus: (ticketId: string, status: string) => Promise<ITicket | null>;
    getStatsByStatus: () => Promise<any[]>;
    getStatsByPriority: () => Promise<any[]>;
    create: (data: Partial<ITicket>) => Promise<ITicket>;
    findById: (id: string, populate?: string | string[]) => Promise<ITicket | null>;
    findOne: (filter: FilterQuery<ITicket>, populate?: string | string[]) => Promise<ITicket | null>;
    findAll: (filter?: FilterQuery<ITicket> | undefined, options?: any) => Promise<ITicket[]>;
    updateById: (id: string, data: import("mongoose").UpdateQuery<ITicket>, options?: import("mongoose").QueryOptions) => Promise<ITicket | null>;
    updateOne: (filter: FilterQuery<ITicket>, data: import("mongoose").UpdateQuery<ITicket>, options?: import("mongoose").QueryOptions) => Promise<ITicket | null>;
    deleteById: (id: string) => Promise<boolean>;
    deleteOne: (filter: FilterQuery<ITicket>) => Promise<boolean>;
    count: (filter?: FilterQuery<ITicket> | undefined) => Promise<number>;
    exists: (filter: FilterQuery<ITicket>) => Promise<boolean>;
    aggregate: (pipeline: any[]) => Promise<any[]>;
};
//# sourceMappingURL=ticket.dao.d.ts.map