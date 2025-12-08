import { createBaseDAO } from './base.dao';
import { Ticket, ITicket } from '../models/Ticket.model';
import { FilterQuery } from 'mongoose';

const baseDAO = createBaseDAO<ITicket>(Ticket);

export const findByTicketId = async (ticketId: string): Promise<ITicket | null> => {
  return await baseDAO.findOne({ ticketId }, ['createdBy', 'assignedTo']);
};

export const findByUser = async (userId: string, options?: any): Promise<ITicket[]> => {
  return await baseDAO.findAll({ createdBy: userId }, {
    sort: { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
    ...options,
  });
};

export const findByAssignedAgent = async (agentId: string, options?: any): Promise<ITicket[]> => {
  return await baseDAO.findAll({ assignedTo: agentId }, {
    sort: { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
    ...options,
  });
};

export const findWithFilters = async (filters: {
  status?: string | string[];
  priority?: string | string[];
  type?: string;
  category?: string;
  createdBy?: string;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
}, options?: any): Promise<ITicket[]> => {
  const query: FilterQuery<ITicket> = {};

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
    query.createdBy = filters.createdBy as any;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo as any;
  }

  if (filters.dateFrom || filters.dateTo) {
    query.createdAt = {};
    if (filters.dateFrom) {
      (query.createdAt as any).$gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      (query.createdAt as any).$lte = filters.dateTo;
    }
  }

  return await baseDAO.findAll(query, {
    sort: { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
    ...options,
  });
};

export const addComment = async (
  ticketId: string,
  comment: { user: string; userName: string; text: string; attachments?: string[] }
): Promise<ITicket | null> => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return null;

  ticket.comments.push({
    ...comment,
    attachments: comment.attachments || [],
    createdAt: new Date(),
  } as any);

  await ticket.save();
  return ticket;
};

export const assignAgent = async (ticketId: string, agentId: string): Promise<ITicket | null> => {
  return await baseDAO.updateById(ticketId, { assignedTo: agentId } as any);
};

export const updateStatus = async (ticketId: string, status: string): Promise<ITicket | null> => {
  return await baseDAO.updateById(ticketId, { status } as any);
};

export const getStatsByStatus = async (): Promise<any[]> => {
  return await baseDAO.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
};

export const getStatsByPriority = async (): Promise<any[]> => {
  return await baseDAO.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);
};

export const ticketDAO = {
  ...baseDAO,
  findByTicketId,
  findByUser,
  findByAssignedAgent,
  findWithFilters,
  addComment,
  assignAgent,
  updateStatus,
  getStatsByStatus,
  getStatsByPriority,
};
