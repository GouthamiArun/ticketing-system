"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketService = exports.markAsResolved = exports.getTicketStats = exports.assignTicket = exports.addComment = exports.updateTicket = exports.countAllTickets = exports.getAllTickets = exports.countAssignedTickets = exports.getAssignedTickets = exports.countUserTickets = exports.getUserTickets = exports.getTicketByTicketId = exports.getTicketById = exports.createTicket = void 0;
const ticket_dao_1 = require("../dao/ticket.dao");
const user_dao_1 = require("../dao/user.dao");
const constants_1 = require("../config/constants");
const email_util_1 = require("../utils/email.util");
const date_util_1 = require("../utils/date.util");
const createTicket = async (userId, data) => {
    const user = await user_dao_1.userDAO.findById(userId);
    const ticket = await ticket_dao_1.ticketDAO.create({
        ...data,
        createdBy: userId,
        status: constants_1.TICKET_STATUS.OPEN,
        timeline: [{
                event: 'created',
                performedBy: userId,
                performedByName: user?.name || 'Unknown',
                timestamp: (0, date_util_1.getCurrentIST)(),
                details: `Ticket created with priority: ${data.priority}`,
            }],
    });
    // Send email notification to creator
    if (user) {
        await (0, email_util_1.sendTicketCreatedEmail)(ticket, user);
    }
    return ticket;
};
exports.createTicket = createTicket;
const getTicketById = async (ticketId, userId, userRole) => {
    const ticket = await ticket_dao_1.ticketDAO.findById(ticketId, ['createdBy', 'assignedTo', 'comments.user']);
    if (!ticket) {
        return null;
    }
    // Agents can only view tickets assigned to them
    if (userRole === constants_1.ROLES.AGENT && userId) {
        const assignedToId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();
        if (assignedToId !== userId) {
            throw new Error('Access denied: You can only view tickets assigned to you');
        }
    }
    return ticket;
};
exports.getTicketById = getTicketById;
const getTicketByTicketId = async (ticketId) => {
    return await ticket_dao_1.ticketDAO.findByTicketId(ticketId);
};
exports.getTicketByTicketId = getTicketByTicketId;
const getUserTickets = async (userId, filters, skip, limit, sort) => {
    const options = {
        sort: sort || { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
    };
    if (skip !== undefined)
        options.skip = skip;
    if (limit !== undefined)
        options.limit = limit;
    const query = { createdBy: userId, ...filters };
    return await ticket_dao_1.ticketDAO.findAll(query, options);
};
exports.getUserTickets = getUserTickets;
const countUserTickets = async (userId, filters) => {
    const query = { createdBy: userId, ...filters };
    return await ticket_dao_1.ticketDAO.count(query);
};
exports.countUserTickets = countUserTickets;
const getAssignedTickets = async (agentId, filters, skip, limit, sort) => {
    const options = {
        sort: sort || { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
    };
    if (skip !== undefined)
        options.skip = skip;
    if (limit !== undefined)
        options.limit = limit;
    const query = { assignedTo: agentId, ...filters };
    return await ticket_dao_1.ticketDAO.findAll(query, options);
};
exports.getAssignedTickets = getAssignedTickets;
const countAssignedTickets = async (agentId, filters) => {
    const query = { assignedTo: agentId, ...filters };
    return await ticket_dao_1.ticketDAO.count(query);
};
exports.countAssignedTickets = countAssignedTickets;
const getAllTickets = async (filters, skip, limit, sort) => {
    const options = {
        sort: sort || { createdAt: -1 },
        populate: ['createdBy', 'assignedTo'],
    };
    if (skip !== undefined)
        options.skip = skip;
    if (limit !== undefined)
        options.limit = limit;
    if (filters) {
        return await ticket_dao_1.ticketDAO.findWithFilters(filters, options);
    }
    return await ticket_dao_1.ticketDAO.findAll({}, options);
};
exports.getAllTickets = getAllTickets;
const countAllTickets = async (filters) => {
    return await ticket_dao_1.ticketDAO.count(filters || {});
};
exports.countAllTickets = countAllTickets;
const updateTicket = async (ticketId, updates, userId, userRole) => {
    const ticket = await ticket_dao_1.ticketDAO.findById(ticketId);
    if (!ticket) {
        throw new Error('Ticket not found');
    }
    // Agents can only update tickets assigned to them
    if (userRole === constants_1.ROLES.AGENT) {
        const assignedToId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();
        if (assignedToId !== userId) {
            throw new Error('Access denied: You can only update tickets assigned to you');
        }
    }
    const oldStatus = ticket.status;
    const user = await user_dao_1.userDAO.findById(userId);
    // Add timeline event for status change
    if (updates.status && updates.status !== oldStatus) {
        const timelineEvent = {
            event: updates.status === constants_1.TICKET_STATUS.RESOLVED ? 'resolved' :
                updates.status === constants_1.TICKET_STATUS.CLOSED ? 'closed' : 'status_changed',
            performedBy: userId,
            performedByName: user?.name || 'Unknown',
            timestamp: (0, date_util_1.getCurrentIST)(),
            details: `Status changed from ${oldStatus} to ${updates.status}`,
            oldValue: oldStatus,
            newValue: updates.status,
        };
        const currentTimeline = ticket.timeline || [];
        updates.timeline = [...currentTimeline, timelineEvent];
    }
    const updatedTicket = await ticket_dao_1.ticketDAO.updateById(ticketId, updates);
    // Send email if status changed
    if (updates.status && updates.status !== oldStatus && updatedTicket) {
        const creator = await user_dao_1.userDAO.findById(ticket.createdBy.toString());
        if (creator) {
            await (0, email_util_1.sendStatusUpdateEmail)(ticket.ticketId, updates.status, creator, 'ticket');
        }
    }
    return updatedTicket;
};
exports.updateTicket = updateTicket;
const addComment = async (ticketId, userId, text, attachments, userRole) => {
    const user = await user_dao_1.userDAO.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const ticket = await ticket_dao_1.ticketDAO.findById(ticketId);
    if (!ticket) {
        throw new Error('Ticket not found');
    }
    // Agents can only comment on tickets assigned to them
    if (userRole === constants_1.ROLES.AGENT) {
        const assignedToId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();
        if (assignedToId !== userId) {
            throw new Error('Access denied: You can only comment on tickets assigned to you');
        }
    }
    const result = await ticket_dao_1.ticketDAO.addComment(ticketId, {
        user: userId,
        userName: user.name,
        text,
        attachments: attachments || [],
    });
    // Add timeline event for comment
    if (result) {
        const timelineEvent = {
            event: 'commented',
            performedBy: userId,
            performedByName: user.name,
            timestamp: (0, date_util_1.getCurrentIST)(),
            details: `Added a comment${attachments && attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ''}`,
        };
        const currentTimeline = result.timeline || [];
        await ticket_dao_1.ticketDAO.updateById(ticketId, {
            timeline: [...currentTimeline, timelineEvent]
        });
    }
    return result;
};
exports.addComment = addComment;
const assignTicket = async (ticketId, agentId, assignedBy) => {
    const agent = await user_dao_1.userDAO.findById(agentId);
    const assignedByUser = await user_dao_1.userDAO.findById(assignedBy);
    if (!agent) {
        throw new Error('Agent not found');
    }
    if (agent.role !== constants_1.ROLES.AGENT && agent.role !== constants_1.ROLES.ADMIN) {
        throw new Error('Can only assign to agents or admins');
    }
    const ticket = await ticket_dao_1.ticketDAO.findById(ticketId);
    if (!ticket) {
        throw new Error('Ticket not found');
    }
    const wasAssigned = !!ticket.assignedTo;
    const updatedTicket = await ticket_dao_1.ticketDAO.assignAgent(ticketId, agentId);
    if (updatedTicket) {
        // Add timeline event
        const timelineEvent = {
            event: wasAssigned ? 'reassigned' : 'assigned',
            performedBy: assignedBy,
            performedByName: assignedByUser?.name || 'Admin',
            timestamp: (0, date_util_1.getCurrentIST)(),
            details: `Ticket ${wasAssigned ? 'reassigned' : 'assigned'} to ${agent.name}`,
            newValue: agent.name,
        };
        const currentTimeline = updatedTicket.timeline || [];
        await ticket_dao_1.ticketDAO.updateById(ticketId, {
            timeline: [...currentTimeline, timelineEvent]
        });
        await (0, email_util_1.sendAssignmentEmail)(updatedTicket.ticketId, agent, 'ticket');
    }
    return updatedTicket;
};
exports.assignTicket = assignTicket;
const getTicketStats = async () => {
    const [statusStats, priorityStats, totalCount] = await Promise.all([
        ticket_dao_1.ticketDAO.getStatsByStatus(),
        ticket_dao_1.ticketDAO.getStatsByPriority(),
        ticket_dao_1.ticketDAO.count({}),
    ]);
    return {
        total: totalCount,
        byStatus: statusStats,
        byPriority: priorityStats,
    };
};
exports.getTicketStats = getTicketStats;
const markAsResolved = async (ticketId, userId) => {
    const ticket = await ticket_dao_1.ticketDAO.findById(ticketId);
    if (!ticket) {
        throw new Error('Ticket not found');
    }
    const updatedTicket = await ticket_dao_1.ticketDAO.updateById(ticketId, {
        status: constants_1.TICKET_STATUS.RESOLVED,
    });
    // Send email notification
    if (updatedTicket) {
        const creator = await user_dao_1.userDAO.findById(ticket.createdBy.toString());
        if (creator) {
            await (0, email_util_1.sendStatusUpdateEmail)(ticket.ticketId, constants_1.TICKET_STATUS.RESOLVED, creator, 'ticket');
        }
    }
    return updatedTicket;
};
exports.markAsResolved = markAsResolved;
exports.ticketService = {
    createTicket: exports.createTicket,
    getTicketById: exports.getTicketById,
    getTicketByTicketId: exports.getTicketByTicketId,
    getUserTickets: exports.getUserTickets,
    countUserTickets: exports.countUserTickets,
    getAssignedTickets: exports.getAssignedTickets,
    countAssignedTickets: exports.countAssignedTickets,
    getAllTickets: exports.getAllTickets,
    countAllTickets: exports.countAllTickets,
    updateTicket: exports.updateTicket,
    addComment: exports.addComment,
    assignTicket: exports.assignTicket,
    getTicketStats: exports.getTicketStats,
    markAsResolved: exports.markAsResolved,
};
//# sourceMappingURL=ticket.service.js.map