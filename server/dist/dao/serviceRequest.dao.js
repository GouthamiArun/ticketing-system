"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRequestDAO = exports.countWithFilters = exports.countByAssignedAgent = exports.countByUser = exports.getStatsByStatus = exports.updateStatus = exports.assignAgent = exports.addComment = exports.findWithFilters = exports.findByAssignedAgent = exports.findByUser = exports.findByRequestId = void 0;
const base_dao_1 = require("./base.dao");
const ServiceRequest_model_1 = require("../models/ServiceRequest.model");
const baseDAO = (0, base_dao_1.createBaseDAO)(ServiceRequest_model_1.ServiceRequest);
const findByRequestId = async (requestId) => {
    return await baseDAO.findOne({ requestId }, ['createdBy', 'assignedTo']);
};
exports.findByRequestId = findByRequestId;
const findByUser = async (userId, options) => {
    const { status, priority, type, $or, skip, limit, ...restOptions } = options || {};
    const query = { createdBy: userId };
    if (status)
        query.status = status;
    if (priority)
        query.priority = priority;
    if (type)
        query.type = type;
    if ($or)
        query.$or = $or;
    const queryOptions = {
        sort: { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
        ...restOptions,
    };
    if (skip !== undefined)
        queryOptions.skip = skip;
    if (limit !== undefined)
        queryOptions.limit = limit;
    return await baseDAO.findAll(query, queryOptions);
};
exports.findByUser = findByUser;
const findByAssignedAgent = async (agentId, options) => {
    const { status, priority, type, $or, skip, limit, ...restOptions } = options || {};
    const query = { assignedTo: agentId };
    if (status)
        query.status = status;
    if (priority)
        query.priority = priority;
    if (type)
        query.type = type;
    if ($or)
        query.$or = $or;
    const queryOptions = {
        sort: { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
        ...restOptions,
    };
    if (skip !== undefined)
        queryOptions.skip = skip;
    if (limit !== undefined)
        queryOptions.limit = limit;
    return await baseDAO.findAll(query, queryOptions);
};
exports.findByAssignedAgent = findByAssignedAgent;
const findWithFilters = async (filters, options) => {
    const query = {};
    if (filters.status) {
        query.status = Array.isArray(filters.status)
            ? { $in: filters.status }
            : filters.status;
    }
    if (filters.priority) {
        query.priority = Array.isArray(filters.priority)
            ? { $in: filters.priority }
            : filters.priority;
    }
    if (filters.type) {
        query.type = filters.type;
    }
    if (filters.serviceType) {
        query.serviceType = filters.serviceType;
    }
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.createdBy) {
        query.createdBy = filters.createdBy;
    }
    if (filters.assignedTo) {
        query.assignedTo = filters.assignedTo;
    }
    if (filters.$or) {
        query.$or = filters.$or;
    }
    if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
            query.createdAt.$gte = filters.dateFrom;
        }
        if (filters.dateTo) {
            query.createdAt.$lte = filters.dateTo;
        }
    }
    return await baseDAO.findAll(query, {
        sort: { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
        ...options,
    });
};
exports.findWithFilters = findWithFilters;
const addComment = async (requestId, comment) => {
    const request = await ServiceRequest_model_1.ServiceRequest.findById(requestId);
    if (!request)
        return null;
    request.comments.push({
        ...comment,
        createdAt: new Date(),
    });
    await request.save();
    return request;
};
exports.addComment = addComment;
const assignAgent = async (requestId, agentId) => {
    return await baseDAO.updateById(requestId, { assignedTo: agentId });
};
exports.assignAgent = assignAgent;
const updateStatus = async (requestId, status) => {
    return await baseDAO.updateById(requestId, { status });
};
exports.updateStatus = updateStatus;
const getStatsByStatus = async () => {
    return await baseDAO.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);
};
exports.getStatsByStatus = getStatsByStatus;
const countByUser = async (userId, filters) => {
    const query = { createdBy: userId };
    if (filters) {
        const { status, priority, type, $or } = filters;
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (type)
            query.type = type;
        if ($or)
            query.$or = $or;
    }
    return await baseDAO.count(query);
};
exports.countByUser = countByUser;
const countByAssignedAgent = async (agentId, filters) => {
    const query = { assignedTo: agentId };
    if (filters) {
        const { status, priority, type, $or } = filters;
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (type)
            query.type = type;
        if ($or)
            query.$or = $or;
    }
    return await baseDAO.count(query);
};
exports.countByAssignedAgent = countByAssignedAgent;
const countWithFilters = async (filters) => {
    const query = {};
    if (filters.status) {
        query.status = Array.isArray(filters.status)
            ? { $in: filters.status }
            : filters.status;
    }
    if (filters.priority) {
        query.priority = Array.isArray(filters.priority)
            ? { $in: filters.priority }
            : filters.priority;
    }
    if (filters.type) {
        query.type = filters.type;
    }
    if (filters.serviceType) {
        query.serviceType = filters.serviceType;
    }
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.createdBy) {
        query.createdBy = filters.createdBy;
    }
    if (filters.assignedTo) {
        query.assignedTo = filters.assignedTo;
    }
    if (filters.$or) {
        query.$or = filters.$or;
    }
    if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
            query.createdAt.$gte = filters.dateFrom;
        }
        if (filters.dateTo) {
            query.createdAt.$lte = filters.dateTo;
        }
    }
    return await baseDAO.count(query);
};
exports.countWithFilters = countWithFilters;
exports.serviceRequestDAO = {
    ...baseDAO,
    findByRequestId: exports.findByRequestId,
    findByUser: exports.findByUser,
    findByAssignedAgent: exports.findByAssignedAgent,
    findWithFilters: exports.findWithFilters,
    addComment: exports.addComment,
    assignAgent: exports.assignAgent,
    updateStatus: exports.updateStatus,
    getStatsByStatus: exports.getStatsByStatus,
    countByUser: exports.countByUser,
    countByAssignedAgent: exports.countByAssignedAgent,
    countWithFilters: exports.countWithFilters,
};
//# sourceMappingURL=serviceRequest.dao.js.map