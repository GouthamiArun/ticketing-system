import { createBaseDAO } from './base.dao';
import { ServiceRequest, IServiceRequest } from '../models/ServiceRequest.model';
import { FilterQuery } from 'mongoose';

const baseDAO = createBaseDAO<IServiceRequest>(ServiceRequest);

export const findByRequestId = async (requestId: string): Promise<IServiceRequest | null> => {
  return await baseDAO.findOne({ requestId }, ['createdBy', 'assignedTo']);
};

export const findByUser = async (userId: string, options?: any): Promise<IServiceRequest[]> => {
  const { status, priority, type, $or, skip, limit, ...restOptions } = options || {};
  
  const query: any = { createdBy: userId };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (type) query.type = type;
  if ($or) query.$or = $or;
  
  const queryOptions: any = {
    sort: { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
    ...restOptions,
  };
  
  if (skip !== undefined) queryOptions.skip = skip;
  if (limit !== undefined) queryOptions.limit = limit;
  
  return await baseDAO.findAll(query, queryOptions);
};

export const findByAssignedAgent = async (agentId: string, options?: any): Promise<IServiceRequest[]> => {
  const { status, priority, type, $or, skip, limit, ...restOptions } = options || {};
  
  const query: any = { assignedTo: agentId };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (type) query.type = type;
  if ($or) query.$or = $or;
  
  const queryOptions: any = {
    sort: { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
    ...restOptions,
  };
  
  if (skip !== undefined) queryOptions.skip = skip;
  if (limit !== undefined) queryOptions.limit = limit;
  
  return await baseDAO.findAll(query, queryOptions);
};

export const findWithFilters = async (filters: {
  status?: string | string[];
  priority?: string | string[];
  type?: string;
  serviceType?: string;
  category?: string;
  createdBy?: string;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  $or?: any[];
}, options?: any): Promise<IServiceRequest[]> => {
  const query: FilterQuery<IServiceRequest> = {};

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
    query.createdBy = filters.createdBy as any;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo as any;
  }

  if (filters.$or) {
    query.$or = filters.$or;
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
  requestId: string,
  comment: { user: string; userName: string; text: string }
): Promise<IServiceRequest | null> => {
  const request = await ServiceRequest.findById(requestId);
  if (!request) return null;

  request.comments.push({
    ...comment,
    createdAt: new Date(),
  } as any);

  await request.save();
  return request;
};

export const assignAgent = async (requestId: string, agentId: string): Promise<IServiceRequest | null> => {
  return await baseDAO.updateById(requestId, { assignedTo: agentId } as any);
};

export const updateStatus = async (requestId: string, status: string): Promise<IServiceRequest | null> => {
  return await baseDAO.updateById(requestId, { status } as any);
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

export const countByUser = async (userId: string, filters?: any): Promise<number> => {
  const query: any = { createdBy: userId };
  if (filters) {
    const { status, priority, type, $or } = filters;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;
    if ($or) query.$or = $or;
  }
  return await baseDAO.count(query);
};

export const countByAssignedAgent = async (agentId: string, filters?: any): Promise<number> => {
  const query: any = { assignedTo: agentId };
  if (filters) {
    const { status, priority, type, $or } = filters;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;
    if ($or) query.$or = $or;
  }
  return await baseDAO.count(query);
};

export const countWithFilters = async (filters: {
  status?: string | string[];
  priority?: string | string[];
  type?: string;
  serviceType?: string;
  category?: string;
  createdBy?: string;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  $or?: any[];
}): Promise<number> => {
  const query: FilterQuery<IServiceRequest> = {};

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
    query.createdBy = filters.createdBy as any;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo as any;
  }

  if (filters.$or) {
    query.$or = filters.$or;
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

  return await baseDAO.count(query);
};

export const serviceRequestDAO = {
  ...baseDAO,
  findByRequestId,
  findByUser,
  findByAssignedAgent,
  findWithFilters,
  addComment,
  assignAgent,
  updateStatus,
  getStatsByStatus,
  countByUser,
  countByAssignedAgent,
  countWithFilters,
};
