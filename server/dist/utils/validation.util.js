"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = exports.createCategorySchema = exports.createUserSchema = exports.updateServiceRequestSchema = exports.updateTicketSchema = exports.createServiceRequestSchema = exports.createTicketSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../config/constants");
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(1, 'Name is required'),
    department: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.createTicketSchema = zod_1.z.object({
    type: zod_1.z.enum([constants_1.TYPE.HARDWARE, constants_1.TYPE.SOFTWARE]),
    category: zod_1.z.string().min(1, 'Category is required'),
    subcategory: zod_1.z.string().min(1, 'Subcategory is required'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    priority: zod_1.z.enum([constants_1.PRIORITY.LOW, constants_1.PRIORITY.MEDIUM, constants_1.PRIORITY.HIGH, constants_1.PRIORITY.CRITICAL]),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.createServiceRequestSchema = zod_1.z.object({
    serviceType: zod_1.z.enum([
        constants_1.SERVICE_TYPE.IT_ASSISTANCE_TRAININGS,
        constants_1.SERVICE_TYPE.IT_ASSISTANCE_WORKSHOPS,
        constants_1.SERVICE_TYPE.IT_ASSISTANCE_WRITESHOPS,
    ]),
    dateFrom: zod_1.z.string().or(zod_1.z.date()),
    dateTo: zod_1.z.string().or(zod_1.z.date()),
    duration: zod_1.z.string().min(1, 'Duration is required'),
    typeOfService: zod_1.z.enum([
        constants_1.TYPE_OF_SERVICE.EQUIPMENT_SETUP,
        constants_1.TYPE_OF_SERVICE.EQUIPMENT_AND_HANDHOLDING,
    ]),
    type: zod_1.z.enum([constants_1.TYPE.HARDWARE, constants_1.TYPE.SOFTWARE]),
    category: zod_1.z.string().min(1, 'Category is required'),
    subcategory: zod_1.z.string().min(1, 'Subcategory is required'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    priority: zod_1.z.enum([constants_1.PRIORITY.LOW, constants_1.PRIORITY.MEDIUM, constants_1.PRIORITY.HIGH, constants_1.PRIORITY.CRITICAL]),
});
exports.updateTicketSchema = zod_1.z.object({
    status: zod_1.z.enum([
        constants_1.TICKET_STATUS.OPEN,
        constants_1.TICKET_STATUS.IN_PROGRESS,
        constants_1.TICKET_STATUS.RESOLVED,
        constants_1.TICKET_STATUS.CLOSED,
        constants_1.TICKET_STATUS.REJECTED,
    ]).optional(),
    priority: zod_1.z.enum([constants_1.PRIORITY.LOW, constants_1.PRIORITY.MEDIUM, constants_1.PRIORITY.HIGH, constants_1.PRIORITY.CRITICAL]).optional(),
    assignedTo: zod_1.z.string().optional(),
});
exports.updateServiceRequestSchema = zod_1.z.object({
    status: zod_1.z.enum([
        constants_1.SERVICE_REQUEST_STATUS.PENDING,
        constants_1.SERVICE_REQUEST_STATUS.APPROVED,
        constants_1.SERVICE_REQUEST_STATUS.IN_PROGRESS,
        constants_1.SERVICE_REQUEST_STATUS.COMPLETED,
        constants_1.SERVICE_REQUEST_STATUS.REJECTED,
    ]).optional(),
    priority: zod_1.z.enum([constants_1.PRIORITY.LOW, constants_1.PRIORITY.MEDIUM, constants_1.PRIORITY.HIGH, constants_1.PRIORITY.CRITICAL]).optional(),
    assignedTo: zod_1.z.string().optional(),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(1, 'Name is required'),
    role: zod_1.z.enum([constants_1.ROLES.EMPLOYEE, constants_1.ROLES.AGENT, constants_1.ROLES.ADMIN]),
    department: zod_1.z.string().optional(),
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required'),
    type: zod_1.z.enum([constants_1.TYPE.HARDWARE, constants_1.TYPE.SOFTWARE]),
    subcategories: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.commentSchema = zod_1.z.object({
    text: zod_1.z.string().min(1, 'Comment text is required'),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
});
//# sourceMappingURL=validation.util.js.map