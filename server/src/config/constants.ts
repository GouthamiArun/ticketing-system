export const ROLES = {
  EMPLOYEE: 'employee',
  AGENT: 'agent',
  ADMIN: 'admin',
} as const;

export const TICKET_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
} as const;

export const SERVICE_REQUEST_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
} as const;

export const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

export const TYPE = {
  HARDWARE: 'Hardware',
  SOFTWARE: 'Software',
} as const;

export const SERVICE_TYPE = {
  IT_ASSISTANCE_TRAININGS: 'IT assistance to trainings',
  IT_ASSISTANCE_WORKSHOPS: 'IT assistance to workshops',
  IT_ASSISTANCE_WRITESHOPS: 'IT assistance to Writeshops',
} as const;

export const TYPE_OF_SERVICE = {
  EQUIPMENT_SETUP: 'Equipment setup',
  EQUIPMENT_AND_HANDHOLDING: 'Equipment and handholding',
} as const;

export const TICKET_TYPE = {
  COMPLAINT: 'complaint',
  SERVICE_REQUEST: 'service_request',
} as const;
