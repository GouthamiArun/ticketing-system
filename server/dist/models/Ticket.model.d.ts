import mongoose, { Document, Types } from 'mongoose';
import { TICKET_STATUS, PRIORITY, TYPE, TICKET_TYPE } from '../config/constants';
export interface IComment {
    user: Types.ObjectId;
    userName: string;
    text: string;
    attachments: string[];
    createdAt: Date;
}
export interface ITimelineEvent {
    event: 'created' | 'assigned' | 'status_changed' | 'commented' | 'resolved' | 'closed' | 'reassigned';
    performedBy: Types.ObjectId;
    performedByName: string;
    timestamp: string;
    details?: string;
    oldValue?: string;
    newValue?: string;
}
export interface ITicket extends Document {
    ticketId: string;
    ticketType: typeof TICKET_TYPE.COMPLAINT;
    type: typeof TYPE[keyof typeof TYPE];
    category: string;
    subcategory: string;
    description: string;
    priority: typeof PRIORITY[keyof typeof PRIORITY];
    status: typeof TICKET_STATUS[keyof typeof TICKET_STATUS];
    createdBy: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    attachments: string[];
    comments: IComment[];
    timeline: ITimelineEvent[];
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Ticket: mongoose.Model<ITicket, {}, {}, {}, mongoose.Document<unknown, {}, ITicket, {}, {}> & ITicket & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Ticket.model.d.ts.map