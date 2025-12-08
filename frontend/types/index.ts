export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'agent' | 'admin';
  department?: string;
  isActive: boolean;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  ticketType: 'complaint';
  type: 'Hardware' | 'Software';
  category: string;
  subcategory: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Rejected';
  createdBy: User | string;
  assignedTo?: User | string;
  attachments: string[];
  comments: Comment[];
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  _id: string;
  requestId: string;
  ticketType: 'service_request';
  serviceType: string;
  dateFrom: string;
  dateTo: string;
  duration: string;
  typeOfService: string;
  type: 'Hardware' | 'Software';
  category: string;
  subcategory: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';
  createdBy: User | string;
  assignedTo?: User | string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  user: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  type: 'Hardware' | 'Software';
  subcategories: string[];
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface Analytics {
  users: {
    total: number;
    employees: number;
    agents: number;
    admins: number;
  };
  tickets: {
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
  };
  serviceRequests: {
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
  };
}
