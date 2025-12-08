import { Response } from 'express';
import { ticketService } from '../services/ticket.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { createTicketSchema, updateTicketSchema, commentSchema } from '../utils/validation.util';
import { ZodError } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const validatedData = createTicketSchema.parse(req.body);
    
    const ticket = await ticketService.createTicket(req.userId, validatedData);
    res.status(201).json(successResponse('Ticket created successfully', ticket));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to create ticket'));
    }
  }
};

export const getTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority, type, category, assignedTo, dateFrom, dateTo, my, page, limit, search, sortBy, sortOrder } = req.query;

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

    let tickets;
    let total = 0;

    if (my === 'true' && req.userId) {
      const filters: any = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (type) filters.type = type;
      if (search) {
        filters.$or = [
          { ticketId: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      tickets = await ticketService.getUserTickets(req.userId, filters, skip, limitNum, sort);
      total = await ticketService.countUserTickets(req.userId, filters);
    } else if (assignedTo === 'me' && req.userId) {
      const filters: any = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (type) filters.type = type;
      if (search) {
        filters.$or = [
          { ticketId: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      tickets = await ticketService.getAssignedTickets(req.userId, filters, skip, limitNum, sort);
      total = await ticketService.countAssignedTickets(req.userId, filters);
    } else {
      const filters: any = {};
      
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (type) filters.type = type;
      if (category) filters.category = category;
      if (assignedTo && assignedTo !== 'me') filters.assignedTo = assignedTo;
      if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
      if (dateTo) filters.dateTo = new Date(dateTo as string);
      if (search) {
        filters.$or = [
          { ticketId: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      tickets = await ticketService.getAllTickets(filters, skip, limitNum, sort);
      total = await ticketService.countAllTickets(filters);
    }

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json(successResponse('Tickets retrieved', tickets, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get tickets'));
  }
};

export const getTicketById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const ticket = await ticketService.getTicketById(id, req.userId, req.userRole);

    if (!ticket) {
      res.status(404).json(errorResponse('Ticket not found'));
      return;
    }

    res.status(200).json(successResponse('Ticket retrieved', ticket));
  } catch (error) {
    if (error instanceof Error) {
      res.status(403).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to get ticket'));
    }
  }
};

export const updateTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { id } = req.params;
    const validatedData = updateTicketSchema.parse(req.body);

    const ticket = await ticketService.updateTicket(id, validatedData as any, req.userId, req.userRole);

    if (!ticket) {
      res.status(404).json(errorResponse('Ticket not found'));
      return;
    }

    res.status(200).json(successResponse('Ticket updated successfully', ticket));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to update ticket'));
    }
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

    const ticket = await ticketService.addComment(
      id,
      req.userId,
      validatedData.text,
      validatedData.attachments,
      req.userRole
    );

    if (!ticket) {
      res.status(404).json(errorResponse('Ticket not found'));
      return;
    }

    res.status(200).json(successResponse('Comment added successfully', ticket));
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

export const assignTicket = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const ticket = await ticketService.assignTicket(id, agentId, req.userId);

    if (!ticket) {
      res.status(404).json(errorResponse('Ticket not found'));
      return;
    }

    res.status(200).json(successResponse('Ticket assigned successfully', ticket));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to assign ticket'));
    }
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await ticketService.getTicketStats();
    res.status(200).json(successResponse('Stats retrieved', stats));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get stats'));
  }
};

export const markAsResolved = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { id } = req.params;
    const ticket = await ticketService.markAsResolved(id, req.userId);

    if (!ticket) {
      res.status(404).json(errorResponse('Ticket not found'));
      return;
    }

    res.status(200).json(successResponse('Ticket marked as resolved', ticket));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to mark ticket as resolved'));
    }
  }
};

export const ticketController = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
  assignTicket,
  getStats,
  markAsResolved,
};
