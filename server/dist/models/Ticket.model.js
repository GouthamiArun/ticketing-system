"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../config/constants");
const commentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const timelineSchema = new mongoose_1.Schema({
    event: {
        type: String,
        enum: ['created', 'assigned', 'status_changed', 'commented', 'resolved', 'closed', 'reassigned'],
        required: true,
    },
    performedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const ticketSchema = new mongoose_1.Schema({
    ticketId: {
        type: String,
        unique: true,
    },
    ticketType: {
        type: String,
        default: constants_1.TICKET_TYPE.COMPLAINT,
    },
    type: {
        type: String,
        enum: Object.values(constants_1.TYPE),
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
        enum: Object.values(constants_1.PRIORITY),
        required: [true, 'Priority is required'],
    },
    status: {
        type: String,
        enum: Object.values(constants_1.TICKET_STATUS),
        default: constants_1.TICKET_STATUS.OPEN,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Auto-generate ticketId
ticketSchema.pre('save', async function (next) {
    if (!this.ticketId) {
        const count = await mongoose_1.default.model('Ticket').countDocuments();
        this.ticketId = `TCK-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});
// Update resolvedAt when status changes to Resolved
ticketSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === constants_1.TICKET_STATUS.RESOLVED && !this.resolvedAt) {
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
exports.Ticket = mongoose_1.default.model('Ticket', ticketSchema);
//# sourceMappingURL=Ticket.model.js.map