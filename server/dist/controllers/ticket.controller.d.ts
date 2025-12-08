import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const createTicket: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTickets: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTicketById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTicket: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addComment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const assignTicket: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const markAsResolved: (req: AuthRequest, res: Response) => Promise<void>;
export declare const ticketController: {
    createTicket: (req: AuthRequest, res: Response) => Promise<void>;
    getTickets: (req: AuthRequest, res: Response) => Promise<void>;
    getTicketById: (req: AuthRequest, res: Response) => Promise<void>;
    updateTicket: (req: AuthRequest, res: Response) => Promise<void>;
    addComment: (req: AuthRequest, res: Response) => Promise<void>;
    assignTicket: (req: AuthRequest, res: Response) => Promise<void>;
    getStats: (req: AuthRequest, res: Response) => Promise<void>;
    markAsResolved: (req: AuthRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=ticket.controller.d.ts.map