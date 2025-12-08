import { IUser } from '../models/User.model';
import { ITicket } from '../models/Ticket.model';
import { IServiceRequest } from '../models/ServiceRequest.model';
export declare const sendEmail: (to: string, subject: string, html: string) => Promise<void>;
export declare const sendTicketCreatedEmail: (ticket: ITicket, user: IUser) => Promise<void>;
export declare const sendServiceRequestCreatedEmail: (request: IServiceRequest, user: IUser) => Promise<void>;
export declare const sendAssignmentEmail: (ticketId: string, agent: IUser, type: "ticket" | "service_request") => Promise<void>;
export declare const sendStatusUpdateEmail: (ticketId: string, newStatus: string, user: IUser, type: "ticket" | "service_request") => Promise<void>;
//# sourceMappingURL=email.util.d.ts.map