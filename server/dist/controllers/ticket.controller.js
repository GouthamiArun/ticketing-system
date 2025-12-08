"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketController = exports.markAsResolved = exports.getStats = exports.assignTicket = exports.addComment = exports.updateTicket = exports.getTicketById = exports.getTickets = exports.createTicket = void 0;
const ticket_service_1 = require("../services/ticket.service");
const response_util_1 = require("../utils/response.util");
const validation_util_1 = require("../utils/validation.util");
const zod_1 = require("zod");
const createTicket = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const validatedData = validation_util_1.createTicketSchema.parse(req.body);
        const ticket = await ticket_service_1.ticketService.createTicket(req.userId, validatedData);
        res.status(201).json((0, response_util_1.successResponse)('Ticket created successfully', ticket));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create ticket'));
        }
    }
};
exports.createTicket = createTicket;
const getTickets = async (req, res) => {
    try {
        const { status, priority, type, category, assignedTo, dateFrom, dateTo, my, page, limit, search, sortBy, sortOrder } = req.query;
        // Pagination params with max limit of 100
        const pageNum = parseInt(page) || 1;
        const requestedLimit = parseInt(limit) || 10;
        const limitNum = Math.min(requestedLimit, 100); // Max 100 items per page
        const skip = (pageNum - 1) * limitNum;
        // Sorting params
        const sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }
        else {
            sort.createdAt = -1; // Default sort by newest first
        }
        let tickets;
        let total = 0;
        if (my === 'true' && req.userId) {
            const filters = {};
            if (status)
                filters.status = status;
            if (priority)
                filters.priority = priority;
            if (type)
                filters.type = type;
            if (search) {
                filters.$or = [
                    { ticketId: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }
            tickets = await ticket_service_1.ticketService.getUserTickets(req.userId, filters, skip, limitNum, sort);
            total = await ticket_service_1.ticketService.countUserTickets(req.userId, filters);
        }
        else if (assignedTo === 'me' && req.userId) {
            const filters = {};
            if (status)
                filters.status = status;
            if (priority)
                filters.priority = priority;
            if (type)
                filters.type = type;
            if (search) {
                filters.$or = [
                    { ticketId: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }
            tickets = await ticket_service_1.ticketService.getAssignedTickets(req.userId, filters, skip, limitNum, sort);
            total = await ticket_service_1.ticketService.countAssignedTickets(req.userId, filters);
        }
        else {
            const filters = {};
            if (status)
                filters.status = status;
            if (priority)
                filters.priority = priority;
            if (type)
                filters.type = type;
            if (category)
                filters.category = category;
            if (assignedTo && assignedTo !== 'me')
                filters.assignedTo = assignedTo;
            if (dateFrom)
                filters.dateFrom = new Date(dateFrom);
            if (dateTo)
                filters.dateTo = new Date(dateTo);
            if (search) {
                filters.$or = [
                    { ticketId: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }
            tickets = await ticket_service_1.ticketService.getAllTickets(filters, skip, limitNum, sort);
            total = await ticket_service_1.ticketService.countAllTickets(filters);
        }
        const totalPages = Math.ceil(total / limitNum);
        res.status(200).json((0, response_util_1.successResponse)('Tickets retrieved', tickets, {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
        }));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get tickets'));
    }
};
exports.getTickets = getTickets;
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticket_service_1.ticketService.getTicketById(id, req.userId, req.userRole);
        if (!ticket) {
            res.status(404).json((0, response_util_1.errorResponse)('Ticket not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Ticket retrieved', ticket));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(403).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to get ticket'));
        }
    }
};
exports.getTicketById = getTicketById;
const updateTicket = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { id } = req.params;
        const validatedData = validation_util_1.updateTicketSchema.parse(req.body);
        const ticket = await ticket_service_1.ticketService.updateTicket(id, validatedData, req.userId, req.userRole);
        if (!ticket) {
            res.status(404).json((0, response_util_1.errorResponse)('Ticket not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Ticket updated successfully', ticket));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update ticket'));
        }
    }
};
exports.updateTicket = updateTicket;
const addComment = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { id } = req.params;
        const validatedData = validation_util_1.commentSchema.parse(req.body);
        const ticket = await ticket_service_1.ticketService.addComment(id, req.userId, validatedData.text, validatedData.attachments, req.userRole);
        if (!ticket) {
            res.status(404).json((0, response_util_1.errorResponse)('Ticket not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Comment added successfully', ticket));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to add comment'));
        }
    }
};
exports.addComment = addComment;
const assignTicket = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { id } = req.params;
        const { agentId } = req.body;
        if (!agentId) {
            res.status(400).json((0, response_util_1.errorResponse)('Agent ID is required'));
            return;
        }
        const ticket = await ticket_service_1.ticketService.assignTicket(id, agentId, req.userId);
        if (!ticket) {
            res.status(404).json((0, response_util_1.errorResponse)('Ticket not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Ticket assigned successfully', ticket));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to assign ticket'));
        }
    }
};
exports.assignTicket = assignTicket;
const getStats = async (req, res) => {
    try {
        const stats = await ticket_service_1.ticketService.getTicketStats();
        res.status(200).json((0, response_util_1.successResponse)('Stats retrieved', stats));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get stats'));
    }
};
exports.getStats = getStats;
const markAsResolved = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { id } = req.params;
        const ticket = await ticket_service_1.ticketService.markAsResolved(id, req.userId);
        if (!ticket) {
            res.status(404).json((0, response_util_1.errorResponse)('Ticket not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Ticket marked as resolved', ticket));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to mark ticket as resolved'));
        }
    }
};
exports.markAsResolved = markAsResolved;
exports.ticketController = {
    createTicket: exports.createTicket,
    getTickets: exports.getTickets,
    getTicketById: exports.getTicketById,
    updateTicket: exports.updateTicket,
    addComment: exports.addComment,
    assignTicket: exports.assignTicket,
    getStats: exports.getStats,
    markAsResolved: exports.markAsResolved,
};
//# sourceMappingURL=ticket.controller.js.map