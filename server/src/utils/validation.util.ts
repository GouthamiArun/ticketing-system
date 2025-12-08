import { z } from 'zod';
import { ROLES, PRIORITY, TYPE, TICKET_STATUS, SERVICE_REQUEST_STATUS, SERVICE_TYPE, TYPE_OF_SERVICE } from '../config/constants';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  department: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createTicketSchema = z.object({
  type: z.enum([TYPE.HARDWARE, TYPE.SOFTWARE]),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum([PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.CRITICAL]),
  attachments: z.array(z.string()).optional(),
});

export const createServiceRequestSchema = z.object({
  serviceType: z.enum([
    SERVICE_TYPE.IT_ASSISTANCE_TRAININGS,
    SERVICE_TYPE.IT_ASSISTANCE_WORKSHOPS,
    SERVICE_TYPE.IT_ASSISTANCE_WRITESHOPS,
  ]),
  dateFrom: z.string().or(z.date()),
  dateTo: z.string().or(z.date()),
  duration: z.string().min(1, 'Duration is required'),
  typeOfService: z.enum([
    TYPE_OF_SERVICE.EQUIPMENT_SETUP,
    TYPE_OF_SERVICE.EQUIPMENT_AND_HANDHOLDING,
  ]),
  type: z.enum([TYPE.HARDWARE, TYPE.SOFTWARE]),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum([PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.CRITICAL]),
});

export const updateTicketSchema = z.object({
  status: z.enum([
    TICKET_STATUS.OPEN,
    TICKET_STATUS.IN_PROGRESS,
    TICKET_STATUS.RESOLVED,
    TICKET_STATUS.CLOSED,
    TICKET_STATUS.REJECTED,
  ]).optional(),
  priority: z.enum([PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.CRITICAL]).optional(),
  assignedTo: z.string().optional(),
});

export const updateServiceRequestSchema = z.object({
  status: z.enum([
    SERVICE_REQUEST_STATUS.PENDING,
    SERVICE_REQUEST_STATUS.APPROVED,
    SERVICE_REQUEST_STATUS.IN_PROGRESS,
    SERVICE_REQUEST_STATUS.COMPLETED,
    SERVICE_REQUEST_STATUS.REJECTED,
  ]).optional(),
  priority: z.enum([PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.CRITICAL]).optional(),
  assignedTo: z.string().optional(),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum([ROLES.EMPLOYEE, ROLES.AGENT, ROLES.ADMIN]),
  department: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: z.enum([TYPE.HARDWARE, TYPE.SOFTWARE]),
  subcategories: z.array(z.string()).optional(),
});

export const commentSchema = z.object({
  text: z.string().min(1, 'Comment text is required'),
  attachments: z.array(z.string()).optional(),
});
