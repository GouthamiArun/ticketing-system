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
exports.ServiceRequest = void 0;
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
const serviceRequestSchema = new mongoose_1.Schema({
    requestId: {
        type: String,
        unique: true,
    },
    ticketType: {
        type: String,
        default: constants_1.TICKET_TYPE.SERVICE_REQUEST,
    },
    serviceType: {
        type: String,
        enum: Object.values(constants_1.SERVICE_TYPE),
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
        enum: Object.values(constants_1.TYPE_OF_SERVICE),
        required: [true, 'Type of service is required'],
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
        enum: Object.values(constants_1.SERVICE_REQUEST_STATUS),
        default: constants_1.SERVICE_REQUEST_STATUS.PENDING,
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
    comments: {
        type: [commentSchema],
        default: [],
    },
    timeline: {
        type: [timelineSchema],
        default: [],
    },
}, {
    timestamps: true,
});
// Auto-generate requestId
serviceRequestSchema.pre('save', async function (next) {
    if (!this.requestId) {
        const count = await mongoose_1.default.model('ServiceRequest').countDocuments();
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
exports.ServiceRequest = mongoose_1.default.model('ServiceRequest', serviceRequestSchema);
//# sourceMappingURL=ServiceRequest.model.js.map