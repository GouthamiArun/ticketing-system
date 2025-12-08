import { Response } from 'express';
import { serviceRequestService } from '../services/serviceRequest.service';
import { successResponse, errorResponse } from '../utils/response.util';
import {
  createServiceRequestSchema,
  updateServiceRequestSchema,
  commentSchema,
} from '../utils/validation.util';
import { ZodError } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createServiceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const validatedData = createServiceRequestSchema.parse(req.body);
    
    const serviceRequest = await serviceRequestService.createServiceRequest(
      req.userId,
      validatedData as any
    );

    res.status(201).json(successResponse('Service request created successfully', serviceRequest));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to create service request'));
    }
  }
};

export const getServiceRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      priority,
      type,
      serviceType,
      category,
      assignedTo,
      dateFrom,
      dateTo,
      my,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    } = req.query;

    // Pagination params with max limit of 100
    const pageNum = parseInt(page as string) || 1;
    const requestedLimit = parseInt(limit as string) || 10;
    const limitNum = Math.min(requestedLimit, 100); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;

    // Sorting params
    const sort: any = {};
    if (sortBy) {
      sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by newest first
    }

    let serviceRequests;
    let total = 0;

    if (my === 'true' && req.userId) {
      const filters: any = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (type) filters.type = type;
      if (search) {
        filters.$or = [
          { requestId: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { serviceType: { $regex: search, $options: 'i' } },
        ];
      }

      serviceRequests = await serviceRequestService.getUserServiceRequests(req.userId, filters, skip, limitNum, sort);
      total = await serviceRequestService.countUserServiceRequests(req.userId, filters);
    } else if (assignedTo === 'me' && req.userId) {
      const filters: any = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (type) filters.type = type;
      if (search) {
        filters.$or = [
          { requestId: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { serviceType: { $regex: search, $options: 'i' } },
        ];
      }

      serviceRequests = await serviceRequestService.getAssignedServiceRequests(req.userId, filters, skip, limitNum, sort);
      total = await serviceRequestService.countAssignedServiceRequests(req.userId, filters);
    } else {
      const filters: any = {};
      
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (type) filters.type = type;
      if (serviceType) filters.serviceType = serviceType;
      if (category) filters.category = category;
      if (assignedTo && assignedTo !== 'me') filters.assignedTo = assignedTo;
      if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
      if (dateTo) filters.dateTo = new Date(dateTo as string);
      if (search) {
        filters.$or = [
          { requestId: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { serviceType: { $regex: search, $options: 'i' } },
        ];
      }

      serviceRequests = await serviceRequestService.getAllServiceRequests(filters, skip, limitNum, sort);
      total = await serviceRequestService.countAllServiceRequests(filters);
    }

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json(successResponse('Service requests retrieved', serviceRequests, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get service requests'));
  }
};

export const getServiceRequestById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const serviceRequest = await serviceRequestService.getServiceRequestById(
      id,
      req.userId,
      req.userRole
    );

    if (!serviceRequest) {
      res.status(404).json(errorResponse('Service request not found'));
      return;
    }

    res.status(200).json(successResponse('Service request retrieved', serviceRequest));
  } catch (error) {
    if (error instanceof Error) {
      res.status(403).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to get service request'));
    }
  }
};

export const updateServiceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { id } = req.params;
    const validatedData = updateServiceRequestSchema.parse(req.body);

    const serviceRequest = await serviceRequestService.updateServiceRequest(
      id,
      validatedData as any,
      req.userId,
      req.userRole
    );

    if (!serviceRequest) {
      res.status(404).json(errorResponse('Service request not found'));
      return;
    }

    res.status(200).json(successResponse('Service request updated successfully', serviceRequest));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to update service request'));
    }
  }
};

export const approveServiceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { id } = req.params;

    const serviceRequest = await serviceRequestService.approveServiceRequest(id, req.userId);

    if (!serviceRequest) {
      res.status(404).json(errorResponse('Service request not found'));
      return;
    }

    res.status(200).json(successResponse('Service request approved successfully', serviceRequest));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to approve service request'));
    }
  }
};

export const rejectServiceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { id } = req.params;

    const serviceRequest = await serviceRequestService.rejectServiceRequest(id, req.userId);

    if (!serviceRequest) {
      res.status(404).json(errorResponse('Service request not found'));
      return;
    }

    res.status(200).json(successResponse('Service request rejected successfully', serviceRequest));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to reject service request'));
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { id } = req.params;
    const validatedData = commentSchema.parse(req.body);

    const serviceRequest = await serviceRequestService.addComment(
      id,
      req.userId,
      validatedData.text,
      req.userRole
    );

    if (!serviceRequest) {
      res.status(404).json(errorResponse('Service request not found'));
      return;
    }

    res.status(200).json(successResponse('Comment added successfully', serviceRequest));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to add comment'));
    }
  }
};

export const assignServiceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      res.status(400).json(errorResponse('Agent ID is required'));
      return;
    }

    const serviceRequest = await serviceRequestService.assignServiceRequest(id, agentId, req.userId);

    if (!serviceRequest) {
      res.status(404).json(errorResponse('Service request not found'));
      return;
    }

    res.status(200).json(successResponse('Service request assigned successfully', serviceRequest));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to assign service request'));
    }
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await serviceRequestService.getServiceRequestStats();
    res.status(200).json(successResponse('Stats retrieved', stats));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get stats'));
  }
};

export const serviceRequestController = {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  approveServiceRequest,
  rejectServiceRequest,
  addComment,
  assignServiceRequest,
  getStats,
};
