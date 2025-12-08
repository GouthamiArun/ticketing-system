"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRequestService = exports.getServiceRequestStats = exports.assignServiceRequest = exports.addComment = exports.rejectServiceRequest = exports.approveServiceRequest = exports.updateServiceRequest = exports.countAllServiceRequests = exports.getAllServiceRequests = exports.countAssignedServiceRequests = exports.getAssignedServiceRequests = exports.countUserServiceRequests = exports.getUserServiceRequests = exports.getServiceRequestByRequestId = exports.getServiceRequestById = exports.createServiceRequest = void 0;
const serviceRequest_dao_1 = require("../dao/serviceRequest.dao");
const user_dao_1 = require("../dao/user.dao");
const constants_1 = require("../config/constants");
const email_util_1 = require("../utils/email.util");
const date_util_1 = require("../utils/date.util");
const createServiceRequest = async (userId, data) => {
    const user = await user_dao_1.userDAO.findById(userId);
    const serviceRequest = await serviceRequest_dao_1.serviceRequestDAO.create({
        ...data,
        createdBy: userId,
        status: constants_1.SERVICE_REQUEST_STATUS.PENDING,
        timeline: [{
                event: 'created',
                performedBy: userId,
                performedByName: user?.name || 'Unknown',
                timestamp: (0, date_util_1.getCurrentIST)(),
                details: `Service request created with priority: ${data.priority}`,
            }],
    });
    // Send email notification to creator
    if (user) {
        await (0, email_util_1.sendServiceRequestCreatedEmail)(serviceRequest, user);
    }
    return serviceRequest;
};
exports.createServiceRequest = createServiceRequest;
const getServiceRequestById = async (requestId, userId, userRole) => {
    const serviceRequest = await serviceRequest_dao_1.serviceRequestDAO.findById(requestId, ['createdBy', 'assignedTo', 'comments.user']);
    if (!serviceRequest) {
        return null;
    }
    // Agents can only view service requests assigned to them
    if (userRole === constants_1.ROLES.AGENT && userId) {
        const assignedToId = serviceRequest.assignedTo?._id?.toString() || serviceRequest.assignedTo?.toString();
        if (assignedToId !== userId) {
            throw new Error('Access denied: You can only view service requests assigned to you');
        }
    }
    return serviceRequest;
};
exports.getServiceRequestById = getServiceRequestById;
const getServiceRequestByRequestId = async (requestId) => {
    return await serviceRequest_dao_1.serviceRequestDAO.findByRequestId(requestId);
};
exports.getServiceRequestByRequestId = getServiceRequestByRequestId;
const getUserServiceRequests = async (userId, filters, skip, limit, sort) => {
    const options = {
        sort: sort || { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
    };
    if (skip !== undefined)
        options.skip = skip;
    if (limit !== undefined)
        options.limit = limit;
    return await serviceRequest_dao_1.serviceRequestDAO.findByUser(userId, { ...filters, ...options });
};
exports.getUserServiceRequests = getUserServiceRequests;
const countUserServiceRequests = async (userId, filters) => {
    return await serviceRequest_dao_1.serviceRequestDAO.countByUser(userId, filters);
};
exports.countUserServiceRequests = countUserServiceRequests;
const getAssignedServiceRequests = async (agentId, filters, skip, limit, sort) => {
    const options = {
        sort: sort || { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
    };
    if (skip !== undefined)
        options.skip = skip;
    if (limit !== undefined)
        options.limit = limit;
    return await serviceRequest_dao_1.serviceRequestDAO.findByAssignedAgent(agentId, { ...filters, ...options });
};
exports.getAssignedServiceRequests = getAssignedServiceRequests;
const countAssignedServiceRequests = async (agentId, filters) => {
    return await serviceRequest_dao_1.serviceRequestDAO.countByAssignedAgent(agentId, filters);
};
exports.countAssignedServiceRequests = countAssignedServiceRequests;
const getAllServiceRequests = async (filters, skip, limit, sort) => {
    const options = {
        sort: sort || { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
    };
    if (skip !== undefined)
        options.skip = skip;
    if (limit !== undefined)
        options.limit = limit;
    if (filters) {
        return await serviceRequest_dao_1.serviceRequestDAO.findWithFilters(filters, options);
    }
    return await serviceRequest_dao_1.serviceRequestDAO.findAll({}, options);
};
exports.getAllServiceRequests = getAllServiceRequests;
const countAllServiceRequests = async (filters) => {
    if (filters) {
        return await serviceRequest_dao_1.serviceRequestDAO.countWithFilters(filters);
    }
    return await serviceRequest_dao_1.serviceRequestDAO.count({});
};
exports.countAllServiceRequests = countAllServiceRequests;
const updateServiceRequest = async (requestId, updates, userId, userRole) => {
    const serviceRequest = await serviceRequest_dao_1.serviceRequestDAO.findById(requestId);
    if (!serviceRequest) {
        throw new Error('Service request not found');
    }
    // Agents can only update service requests assigned to them
    if (userRole === constants_1.ROLES.AGENT) {
        const assignedToId = serviceRequest.assignedTo?._id?.toString() || serviceRequest.assignedTo?.toString();
        if (assignedToId !== userId) {
            throw new Error('Access denied: You can only update service requests assigned to you');
        }
    }
    const oldStatus = serviceRequest.status;
    const user = await user_dao_1.userDAO.findById(userId);
    // Add timeline event for status change
    if (updates.status && updates.status !== oldStatus) {
        const timelineEvent = {
            event: 'status_changed',
            performedBy: userId,
            performedByName: user?.name || 'Unknown',
            timestamp: (0, date_util_1.getCurrentIST)(),
            details: `Status changed from ${oldStatus} to ${updates.status}`,
            oldValue: oldStatus,
            newValue: updates.status,
        };
        const currentTimeline = serviceRequest.timeline || [];
        updates.timeline = [...currentTimeline, timelineEvent];
    }
    const updatedRequest = await serviceRequest_dao_1.serviceRequestDAO.updateById(requestId, updates);
    // Send email if status changed
    if (updates.status && updates.status !== oldStatus && updatedRequest) {
        const creator = await user_dao_1.userDAO.findById(serviceRequest.createdBy.toString());
        if (creator) {
            await (0, email_util_1.sendStatusUpdateEmail)(serviceRequest.requestId, updates.status, creator, 'service_request');
        }
    }
    return updatedRequest;
};
exports.updateServiceRequest = updateServiceRequest;
const approveServiceRequest = async (requestId, approvedBy) => {
    const approver = await user_dao_1.userDAO.findById(approvedBy);
    if (!approver || (approver.role !== constants_1.ROLES.ADMIN && approver.role !== constants_1.ROLES.AGENT)) {
        throw new Error('Only admins and agents can approve service requests');
    }
    const serviceRequest = await serviceRequest_dao_1.serviceRequestDAO.findById(requestId);
    if (!serviceRequest) {
        throw new Error('Service request not found');
    }
    // Add timeline event for approval
    const timelineEvent = {
        event: 'status_changed',
        performedBy: approvedBy,
        performedByName: approver.name,
        timestamp: (0, date_util_1.getCurrentIST)(),
        details: 'Service request approved',
        oldValue: serviceRequest.status,
        newValue: constants_1.SERVICE_REQUEST_STATUS.APPROVED,
    };
    const currentTimeline = serviceRequest.timeline || [];
    const updatedRequest = await serviceRequest_dao_1.serviceRequestDAO.updateById(requestId, {
        status: constants_1.SERVICE_REQUEST_STATUS.APPROVED,
        timeline: [...currentTimeline, timelineEvent],
    });
    if (updatedRequest) {
        const creator = await user_dao_1.userDAO.findById(serviceRequest.createdBy.toString());
        if (creator) {
            await (0, email_util_1.sendStatusUpdateEmail)(serviceRequest.requestId, constants_1.SERVICE_REQUEST_STATUS.APPROVED, creator, 'service_request');
        }
    }
    return updatedRequest;
};
exports.approveServiceRequest = approveServiceRequest;
const rejectServiceRequest = async (requestId, rejectedBy) => {
    const rejector = await user_dao_1.userDAO.findById(rejectedBy);
    const serviceRequest = await serviceRequest_dao_1.serviceRequestDAO.findById(requestId);
    if (!serviceRequest) {
        throw new Error('Service request not found');
    }
    // Add timeline event for rejection
    const timelineEvent = {
        event: 'status_changed',
        performedBy: rejectedBy,
        performedByName: rejector?.name || 'Unknown',
        timestamp: (0, date_util_1.getCurrentIST)(),
        details: 'Service request rejected',
        oldValue: serviceRequest.status,
        newValue: constants_1.SERVICE_REQUEST_STATUS.REJECTED,
    };
    const currentTimeline = serviceRequest.timeline || [];
    const updatedRequest = await serviceRequest_dao_1.serviceRequestDAO.updateById(requestId, {
        status: constants_1.SERVICE_REQUEST_STATUS.REJECTED,
        timeline: [...currentTimeline, timelineEvent],
    });
    if (updatedRequest) {
        const creator = await user_dao_1.userDAO.findById(serviceRequest.createdBy.toString());
        if (creator) {
            await (0, email_util_1.sendStatusUpdateEmail)(serviceRequest.requestId, constants_1.SERVICE_REQUEST_STATUS.REJECTED, creator, 'service_request');
        }
    }
    return serviceRequest;
};
exports.rejectServiceRequest = rejectServiceRequest;
const addComment = async (requestId, userId, text, userRole) => {
    const user = await user_dao_1.userDAO.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const serviceRequest = await serviceRequest_dao_1.serviceRequestDAO.findById(requestId);
    if (!serviceRequest) {
        throw new Error('Service request not found');
    }
    // Agents can only comment on service requests assigned to them
    if (userRole === constants_1.ROLES.AGENT) {
        const assignedToId = serviceRequest.assignedTo?._id?.toString() || serviceRequest.assignedTo?.toString();
        if (assignedToId !== userId) {
            throw new Error('Access denied: You can only comment on service requests assigned to you');
        }
    }
    const result = await serviceRequest_dao_1.serviceRequestDAO.addComment(requestId, {
        user: userId,
        userName: user.name,
        text,
    });
    // Add timeline event for comment
    if (result) {
        const timelineEvent = {
            event: 'commented',
            performedBy: userId,
            performedByName: user.name,
            timestamp: (0, date_util_1.getCurrentIST)(),
            details: 'Added a comment',
        };
        const currentTimeline = result.timeline || [];
        await serviceRequest_dao_1.serviceRequestDAO.updateById(requestId, {
            timeline: [...currentTimeline, timelineEvent]
        });
    }
    return result;
};
exports.addComment = addComment;
const assignServiceRequest = async (requestId, agentId, assignedBy) => {
    const agent = await user_dao_1.userDAO.findById(agentId);
    const assignedByUser = await user_dao_1.userDAO.findById(assignedBy);
    if (!agent) {
        throw new Error('Agent not found');
    }
    if (agent.role !== constants_1.ROLES.AGENT && agent.role !== constants_1.ROLES.ADMIN) {
        throw new Error('Can only assign to agents or admins');
    }
    const serviceRequest = await serviceRequest_dao_1.serviceRequestDAO.findById(requestId);
    if (!serviceRequest) {
        throw new Error('Service request not found');
    }
    const wasAssigned = !!serviceRequest.assignedTo;
    const updatedRequest = await serviceRequest_dao_1.serviceRequestDAO.assignAgent(requestId, agentId);
    if (updatedRequest) {
        // Add timeline event
        const timelineEvent = {
            event: wasAssigned ? 'reassigned' : 'assigned',
            performedBy: assignedBy,
            performedByName: assignedByUser?.name || 'Admin',
            timestamp: (0, date_util_1.getCurrentIST)(),
            details: `Service request ${wasAssigned ? 'reassigned' : 'assigned'} to ${agent.name}`,
            newValue: agent.name,
        };
        const currentTimeline = updatedRequest.timeline || [];
        await serviceRequest_dao_1.serviceRequestDAO.updateById(requestId, {
            timeline: [...currentTimeline, timelineEvent]
        });
        await (0, email_util_1.sendAssignmentEmail)(updatedRequest.requestId, agent, 'service_request');
    }
    return updatedRequest;
};
exports.assignServiceRequest = assignServiceRequest;
const getServiceRequestStats = async () => {
    const [statusStats, totalCount] = await Promise.all([
        serviceRequest_dao_1.serviceRequestDAO.getStatsByStatus(),
        serviceRequest_dao_1.serviceRequestDAO.count({}),
    ]);
    return {
        total: totalCount,
        byStatus: statusStats,
    };
};
exports.getServiceRequestStats = getServiceRequestStats;
exports.serviceRequestService = {
    createServiceRequest: exports.createServiceRequest,
    getServiceRequestById: exports.getServiceRequestById,
    getServiceRequestByRequestId: exports.getServiceRequestByRequestId,
    getUserServiceRequests: exports.getUserServiceRequests,
    countUserServiceRequests: exports.countUserServiceRequests,
    getAssignedServiceRequests: exports.getAssignedServiceRequests,
    countAssignedServiceRequests: exports.countAssignedServiceRequests,
    getAllServiceRequests: exports.getAllServiceRequests,
    countAllServiceRequests: exports.countAllServiceRequests,
    updateServiceRequest: exports.updateServiceRequest,
    approveServiceRequest: exports.approveServiceRequest,
    rejectServiceRequest: exports.rejectServiceRequest,
    addComment: exports.addComment,
    assignServiceRequest: exports.assignServiceRequest,
    getServiceRequestStats: exports.getServiceRequestStats,
};
//# sourceMappingURL=serviceRequest.service.js.map