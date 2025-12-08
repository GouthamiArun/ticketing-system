"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketDAO = exports.getStatsByPriority = exports.getStatsByStatus = exports.updateStatus = exports.assignAgent = exports.addComment = exports.findWithFilters = exports.findByAssignedAgent = exports.findByUser = exports.findByTicketId = void 0;
const base_dao_1 = require("./base.dao");
const Ticket_model_1 = require("../models/Ticket.model");
const baseDAO = (0, base_dao_1.createBaseDAO)(Ticket_model_1.Ticket);
const findByTicketId = async (ticketId) => {
    return await baseDAO.findOne({ ticketId }, ['createdBy', 'assignedTo']);
};
exports.findByTicketId = findByTicketId;
const findByUser = async (userId, options) => {
    return await baseDAO.findAll({ createdBy: userId }, {
        sort: { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
        ...options,
    });
};
exports.findByUser = findByUser;
const findByAssignedAgent = async (agentId, options) => {
    return await baseDAO.findAll({ assignedTo: agentId }, {
        sort: { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
        ...options,
    });
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
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.createdBy) {
        query.createdBy = filters.createdBy;
    }
    if (filters.assignedTo) {
        query.assignedTo = filters.assignedTo;
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
const addComment = async (ticketId, comment) => {
    const ticket = await Ticket_model_1.Ticket.findById(ticketId);
    if (!ticket)
        return null;
    ticket.comments.push({
        ...comment,
        attachments: comment.attachments || [],
        createdAt: new Date(),
    });
    await ticket.save();
    return ticket;
};
exports.addComment = addComment;
const assignAgent = async (ticketId, agentId) => {
    return await baseDAO.updateById(ticketId, { assignedTo: agentId });
};
exports.assignAgent = assignAgent;
const updateStatus = async (ticketId, status) => {
    return await baseDAO.updateById(ticketId, { status });
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
const getStatsByPriority = async () => {
    return await baseDAO.aggregate([
        {
            $group: {
                _id: '$priority',
                count: { $sum: 1 },
            },
        },
    ]);
};
exports.getStatsByPriority = getStatsByPriority;
exports.ticketDAO = {
    ...baseDAO,
    findByTicketId: exports.findByTicketId,
    findByUser: exports.findByUser,
    findByAssignedAgent: exports.findByAssignedAgent,
    findWithFilters: exports.findWithFilters,
    addComment: exports.addComment,
    assignAgent: exports.assignAgent,
    updateStatus: exports.updateStatus,
    getStatsByStatus: exports.getStatsByStatus,
    getStatsByPriority: exports.getStatsByPriority,
};
//# sourceMappingURL=ticket.dao.js.map