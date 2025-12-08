"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRequestController = exports.getStats = exports.assignServiceRequest = exports.addComment = exports.rejectServiceRequest = exports.approveServiceRequest = exports.updateServiceRequest = exports.getServiceRequestById = exports.getServiceRequests = exports.createServiceRequest = void 0;
const serviceRequest_service_1 = require("../services/serviceRequest.service");
const response_util_1 = require("../utils/response.util");
const validation_util_1 = require("../utils/validation.util");
const zod_1 = require("zod");
const createServiceRequest = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const validatedData = validation_util_1.createServiceRequestSchema.parse(req.body);
        const serviceRequest = await serviceRequest_service_1.serviceRequestService.createServiceRequest(req.userId, validatedData);
        res.status(201).json((0, response_util_1.successResponse)('Service request created successfully', serviceRequest));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create service request'));
        }
    }
};
exports.createServiceRequest = createServiceRequest;
const getServiceRequests = async (req, res) => {
    try {
        const { status, priority, type, serviceType, category, assignedTo, dateFrom, dateTo, my, page, limit, search, sortBy, sortOrder, } = req.query;
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
        let serviceRequests;
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
                    { requestId: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { serviceType: { $regex: search, $options: 'i' } },
                ];
            }
            serviceRequests = await serviceRequest_service_1.serviceRequestService.getUserServiceRequests(req.userId, filters, skip, limitNum, sort);
            total = await serviceRequest_service_1.serviceRequestService.countUserServiceRequests(req.userId, filters);
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
                    { requestId: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { serviceType: { $regex: search, $options: 'i' } },
                ];
            }
            serviceRequests = await serviceRequest_service_1.serviceRequestService.getAssignedServiceRequests(req.userId, filters, skip, limitNum, sort);
            total = await serviceRequest_service_1.serviceRequestService.countAssignedServiceRequests(req.userId, filters);
        }
        else {
            const filters = {};
            if (status)
                filters.status = status;
            if (priority)
                filters.priority = priority;
            if (type)
                filters.type = type;
            if (serviceType)
                filters.serviceType = serviceType;
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
                    { requestId: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { serviceType: { $regex: search, $options: 'i' } },
                ];
            }
            serviceRequests = await serviceRequest_service_1.serviceRequestService.getAllServiceRequests(filters, skip, limitNum, sort);
            total = await serviceRequest_service_1.serviceRequestService.countAllServiceRequests(filters);
        }
        const totalPages = Math.ceil(total / limitNum);
        res.status(200).json((0, response_util_1.successResponse)('Service requests retrieved', serviceRequests, {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
        }));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get service requests'));
    }
};
exports.getServiceRequests = getServiceRequests;
const getServiceRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceRequest = await serviceRequest_service_1.serviceRequestService.getServiceRequestById(id, req.userId, req.userRole);
        if (!serviceRequest) {
            res.status(404).json((0, response_util_1.errorResponse)('Service request not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Service request retrieved', serviceRequest));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(403).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to get service request'));
        }
    }
};
exports.getServiceRequestById = getServiceRequestById;
const updateServiceRequest = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { id } = req.params;
        const validatedData = validation_util_1.updateServiceRequestSchema.parse(req.body);
        const serviceRequest = await serviceRequest_service_1.serviceRequestService.updateServiceRequest(id, validatedData, req.userId, req.userRole);
        if (!serviceRequest) {
            res.status(404).json((0, response_util_1.errorResponse)('Service request not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Service request updated successfully', serviceRequest));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update service request'));
        }
    }
};
exports.updateServiceRequest = updateServiceRequest;
const approveServiceRequest = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { id } = req.params;
        const serviceRequest = await serviceRequest_service_1.serviceRequestService.approveServiceRequest(id, req.userId);
        if (!serviceRequest) {
            res.status(404).json((0, response_util_1.errorResponse)('Service request not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Service request approved successfully', serviceRequest));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to approve service request'));
        }
    }
};
exports.approveServiceRequest = approveServiceRequest;
const rejectServiceRequest = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { id } = req.params;
        const serviceRequest = await serviceRequest_service_1.serviceRequestService.rejectServiceRequest(id, req.userId);
        if (!serviceRequest) {
            res.status(404).json((0, response_util_1.errorResponse)('Service request not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Service request rejected successfully', serviceRequest));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to reject service request'));
    }
};
exports.rejectServiceRequest = rejectServiceRequest;
const addComment = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { id } = req.params;
        const validatedData = validation_util_1.commentSchema.parse(req.body);
        const serviceRequest = await serviceRequest_service_1.serviceRequestService.addComment(id, req.userId, validatedData.text, req.userRole);
        if (!serviceRequest) {
            res.status(404).json((0, response_util_1.errorResponse)('Service request not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Comment added successfully', serviceRequest));
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
const assignServiceRequest = async (req, res) => {
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
        const serviceRequest = await serviceRequest_service_1.serviceRequestService.assignServiceRequest(id, agentId, req.userId);
        if (!serviceRequest) {
            res.status(404).json((0, response_util_1.errorResponse)('Service request not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Service request assigned successfully', serviceRequest));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to assign service request'));
        }
    }
};
exports.assignServiceRequest = assignServiceRequest;
const getStats = async (req, res) => {
    try {
        const stats = await serviceRequest_service_1.serviceRequestService.getServiceRequestStats();
        res.status(200).json((0, response_util_1.successResponse)('Stats retrieved', stats));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get stats'));
    }
};
exports.getStats = getStats;
exports.serviceRequestController = {
    createServiceRequest: exports.createServiceRequest,
    getServiceRequests: exports.getServiceRequests,
    getServiceRequestById: exports.getServiceRequestById,
    updateServiceRequest: exports.updateServiceRequest,
    approveServiceRequest: exports.approveServiceRequest,
    rejectServiceRequest: exports.rejectServiceRequest,
    addComment: exports.addComment,
    assignServiceRequest: exports.assignServiceRequest,
    getStats: exports.getStats,
};
//# sourceMappingURL=serviceRequest.controller.js.map