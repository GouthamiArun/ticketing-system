"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICKET_TYPE = exports.TYPE_OF_SERVICE = exports.SERVICE_TYPE = exports.TYPE = exports.PRIORITY = exports.SERVICE_REQUEST_STATUS = exports.TICKET_STATUS = exports.ROLES = void 0;
exports.ROLES = {
    EMPLOYEE: 'employee',
    AGENT: 'agent',
    ADMIN: 'admin',
};
exports.TICKET_STATUS = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
    REJECTED: 'Rejected',
};
exports.SERVICE_REQUEST_STATUS = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
};
exports.PRIORITY = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
};
exports.TYPE = {
    HARDWARE: 'Hardware',
    SOFTWARE: 'Software',
};
exports.SERVICE_TYPE = {
    IT_ASSISTANCE_TRAININGS: 'IT assistance to trainings',
    IT_ASSISTANCE_WORKSHOPS: 'IT assistance to workshops',
    IT_ASSISTANCE_WRITESHOPS: 'IT assistance to Writeshops',
};
exports.TYPE_OF_SERVICE = {
    EQUIPMENT_SETUP: 'Equipment setup',
    EQUIPMENT_AND_HANDHOLDING: 'Equipment and handholding',
};
exports.TICKET_TYPE = {
    COMPLAINT: 'complaint',
    SERVICE_REQUEST: 'service_request',
};
//# sourceMappingURL=constants.js.map