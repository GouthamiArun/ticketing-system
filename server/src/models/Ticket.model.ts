import mongoose, { Schema, Document, Types } from 'mongoose';
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
  timestamp: string; // IST formatted string
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
  attachments: {
    type: [String],
    default: [],
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

const ticketSchema = new Schema<ITicket>(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    ticketType: {
      type: String,
      default: TICKET_TYPE.COMPLAINT,
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
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.OPEN,
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
    attachments: {
      type: [String],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    timeline: {
      type: [timelineSchema],
      default: [],
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate ticketId
ticketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TCK-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Update resolvedAt when status changes to Resolved
ticketSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === TICKET_STATUS.RESOLVED && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

// Indexes for better query performance
ticketSchema.index({ ticketId: 1 });
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdAt: -1 });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
