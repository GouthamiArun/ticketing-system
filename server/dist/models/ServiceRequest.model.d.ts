import mongoose, { Document, Types } from 'mongoose';
import { SERVICE_REQUEST_STATUS, PRIORITY, TYPE, SERVICE_TYPE, TYPE_OF_SERVICE, TICKET_TYPE } from '../config/constants';
import { IComment, ITimelineEvent } from './Ticket.model';
export interface IServiceRequest extends Document {
    requestId: string;
    ticketType: typeof TICKET_TYPE.SERVICE_REQUEST;
    serviceType: typeof SERVICE_TYPE[keyof typeof SERVICE_TYPE];
    dateFrom: Date;
    dateTo: Date;
    duration: string;
    typeOfService: typeof TYPE_OF_SERVICE[keyof typeof TYPE_OF_SERVICE];
    type: typeof TYPE[keyof typeof TYPE];
    category: string;
    subcategory: string;
    description: string;
    priority: typeof PRIORITY[keyof typeof PRIORITY];
    status: typeof SERVICE_REQUEST_STATUS[keyof typeof SERVICE_REQUEST_STATUS];
    createdBy: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    comments: IComment[];
    timeline: ITimelineEvent[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ServiceRequest: mongoose.Model<IServiceRequest, {}, {}, {}, mongoose.Document<unknown, {}, IServiceRequest, {}, {}> & IServiceRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ServiceRequest.model.d.ts.map