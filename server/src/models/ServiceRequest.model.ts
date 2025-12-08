import mongoose, { Schema, Document, Types } from 'mongoose';
import {
  SERVICE_REQUEST_STATUS,
  PRIORITY,
  TYPE,
  SERVICE_TYPE,
  TYPE_OF_SERVICE,
  TICKET_TYPE,
} from '../config/constants';
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

const commentSchema = new Schema<IComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const timelineSchema = new Schema<ITimelineEvent>({
  event: {
    type: String,
    enum: ['created', 'assigned', 'status_changed', 'commented', 'resolved', 'closed', 'reassigned'],
    required: true,
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  performedByName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String, // IST formatted string
    required: true,
  },
  details: {
    type: String,
  },
  oldValue: {
    type: String,
  },
  newValue: {
    type: String,
  },
});

const serviceRequestSchema = new Schema<IServiceRequest>(
  {
    requestId: {
      type: String,
      unique: true,
    },
    ticketType: {
      type: String,
      default: TICKET_TYPE.SERVICE_REQUEST,
    },
    serviceType: {
      type: String,
      enum: Object.values(SERVICE_TYPE),
      required: [true, 'Service type is required'],
    },
    dateFrom: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    dateTo: {
      type: Date,
      required: [true, 'End date is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    typeOfService: {
      type: String,
      enum: Object.values(TYPE_OF_SERVICE),
      required: [true, 'Type of service is required'],
    },
    type: {
      type: String,
      enum: Object.values(TYPE),
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    priority: {
      type: String,
      enum: Object.values(PRIORITY),
      required: [true, 'Priority is required'],
    },
    status: {
      type: String,
      enum: Object.values(SERVICE_REQUEST_STATUS),
      default: SERVICE_REQUEST_STATUS.PENDING,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    timeline: {
      type: [timelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate requestId
serviceRequestSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const count = await mongoose.model('ServiceRequest').countDocuments();
    this.requestId = `SRQ-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes for better query performance
serviceRequestSchema.index({ requestId: 1 });
serviceRequestSchema.index({ status: 1, priority: 1 });
serviceRequestSchema.index({ createdBy: 1 });
serviceRequestSchema.index({ assignedTo: 1 });
serviceRequestSchema.index({ dateFrom: 1, dateTo: 1 });

export const ServiceRequest = mongoose.model<IServiceRequest>(
  'ServiceRequest',
  serviceRequestSchema
);
