import { serviceRequestDAO } from '../dao/serviceRequest.dao';
import { userDAO } from '../dao/user.dao';
import { IServiceRequest } from '../models/ServiceRequest.model';
import { SERVICE_REQUEST_STATUS, ROLES } from '../config/constants';
import {
  sendServiceRequestCreatedEmail,
  sendAssignmentEmail,
  sendStatusUpdateEmail,
} from '../utils/email.util';
import { getCurrentIST } from '../utils/date.util';

export const createServiceRequest = async (
  userId: string,
  data: {
    serviceType: string;
    dateFrom: Date;
    dateTo: Date;
    duration: string;
    typeOfService: string;
    type: string;
    category: string;
    subcategory: string;
    description: string;
    priority: string;
  }
): Promise<IServiceRequest> => {
  const user = await userDAO.findById(userId);
  
  const serviceRequest = await serviceRequestDAO.create({
    ...data,
    createdBy: userId as any,
    status: SERVICE_REQUEST_STATUS.PENDING,
    timeline: [{
      event: 'created',
      performedBy: userId as any,
      performedByName: user?.name || 'Unknown',
      timestamp: getCurrentIST(),
      details: `Service request created with priority: ${data.priority}`,
    }],
  } as any);

  // Send email notification to creator
  if (user) {
    await sendServiceRequestCreatedEmail(serviceRequest, user);
  }

  return serviceRequest;
};

export const getServiceRequestById = async (
  requestId: string,
  userId?: string,
  userRole?: string
): Promise<IServiceRequest | null> => {
  const serviceRequest = await serviceRequestDAO.findById(requestId, ['createdBy', 'assignedTo', 'comments.user']);
  
  if (!serviceRequest) {
    return null;
  }

  // Agents can only view service requests assigned to them
  if (userRole === ROLES.AGENT && userId) {
    const assignedToId = serviceRequest.assignedTo?._id?.toString() || serviceRequest.assignedTo?.toString();
    if (assignedToId !== userId) {
      throw new Error('Access denied: You can only view service requests assigned to you');
    }
  }

  return serviceRequest;
};

export const getServiceRequestByRequestId = async (requestId: string): Promise<IServiceRequest | null> => {
  return await serviceRequestDAO.findByRequestId(requestId);
};

export const getUserServiceRequests = async (
  userId: string,
  filters?: any,
  skip?: number,
  limit?: number,
  sort?: any
): Promise<IServiceRequest[]> => {
  const options: any = {
    sort: sort || { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
  };
  
  if (skip !== undefined) options.skip = skip;
  if (limit !== undefined) options.limit = limit;
  
  return await serviceRequestDAO.findByUser(userId, { ...filters, ...options });
};

export const countUserServiceRequests = async (userId: string, filters?: any): Promise<number> => {
  return await serviceRequestDAO.countByUser(userId, filters);
};

export const getAssignedServiceRequests = async (
  agentId: string,
  filters?: any,
  skip?: number,
  limit?: number,
  sort?: any
): Promise<IServiceRequest[]> => {
  const options: any = {
    sort: sort || { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
  };
  
  if (skip !== undefined) options.skip = skip;
  if (limit !== undefined) options.limit = limit;
  
  return await serviceRequestDAO.findByAssignedAgent(agentId, { ...filters, ...options });
};

export const countAssignedServiceRequests = async (agentId: string, filters?: any): Promise<number> => {
  return await serviceRequestDAO.countByAssignedAgent(agentId, filters);
};

export const getAllServiceRequests = async (
  filters?: any,
  skip?: number,
  limit?: number,
  sort?: any
): Promise<IServiceRequest[]> => {
  const options: any = {
    sort: sort || { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
  };
  
  if (skip !== undefined) options.skip = skip;
  if (limit !== undefined) options.limit = limit;
  
  if (filters) {
    return await serviceRequestDAO.findWithFilters(filters, options);
  }
  return await serviceRequestDAO.findAll({}, options);
};

export const countAllServiceRequests = async (filters?: any): Promise<number> => {
  if (filters) {
    return await serviceRequestDAO.countWithFilters(filters);
  }
  return await serviceRequestDAO.count({});
};

export const updateServiceRequest = async (
  requestId: string,
  updates: Partial<IServiceRequest>,
  userId: string,
  userRole?: string
): Promise<IServiceRequest | null> => {
  const serviceRequest = await serviceRequestDAO.findById(requestId);
  
  if (!serviceRequest) {
    throw new Error('Service request not found');
  }

  // Agents can only update service requests assigned to them
  if (userRole === ROLES.AGENT) {
    const assignedToId = serviceRequest.assignedTo?._id?.toString() || serviceRequest.assignedTo?.toString();
    if (assignedToId !== userId) {
      throw new Error('Access denied: You can only update service requests assigned to you');
    }
  }

  const oldStatus = serviceRequest.status;
  const user = await userDAO.findById(userId);
  
  // Add timeline event for status change
  if (updates.status && updates.status !== oldStatus) {
    const timelineEvent = {
      event: 'status_changed' as const,
      performedBy: userId as any,
      performedByName: user?.name || 'Unknown',
      timestamp: getCurrentIST(),
      details: `Status changed from ${oldStatus} to ${updates.status}`,
      oldValue: oldStatus,
      newValue: updates.status,
    };
    
    const currentTimeline = serviceRequest.timeline || [];
    updates.timeline = [...currentTimeline, timelineEvent] as any;
  }
  
  const updatedRequest = await serviceRequestDAO.updateById(requestId, updates as any);

  // Send email if status changed
  if (updates.status && updates.status !== oldStatus && updatedRequest) {
    const creator = await userDAO.findById(serviceRequest.createdBy.toString());
    if (creator) {
      await sendStatusUpdateEmail(
        serviceRequest.requestId,
        updates.status,
        creator,
        'service_request'
      );
    }
  }

  return updatedRequest;
};

export const approveServiceRequest = async (requestId: string, approvedBy: string): Promise<IServiceRequest | null> => {
  const approver = await userDAO.findById(approvedBy);
  
  if (!approver || (approver.role !== ROLES.ADMIN && approver.role !== ROLES.AGENT)) {
    throw new Error('Only admins and agents can approve service requests');
  }

  const serviceRequest = await serviceRequestDAO.findById(requestId);
  if (!serviceRequest) {
    throw new Error('Service request not found');
  }

  // Add timeline event for approval
  const timelineEvent = {
    event: 'status_changed' as const,
    performedBy: approvedBy as any,
    performedByName: approver.name,
    timestamp: getCurrentIST(),
    details: 'Service request approved',
    oldValue: serviceRequest.status,
    newValue: SERVICE_REQUEST_STATUS.APPROVED,
  };
  
  const currentTimeline = serviceRequest.timeline || [];
  const updatedRequest = await serviceRequestDAO.updateById(requestId, {
    status: SERVICE_REQUEST_STATUS.APPROVED,
    timeline: [...currentTimeline, timelineEvent],
  } as any);

  if (updatedRequest) {
    const creator = await userDAO.findById(serviceRequest.createdBy.toString());
    if (creator) {
      await sendStatusUpdateEmail(
        serviceRequest.requestId,
        SERVICE_REQUEST_STATUS.APPROVED,
        creator,
        'service_request'
      );
    }
  }

  return updatedRequest;
};

export const rejectServiceRequest = async (requestId: string, rejectedBy: string): Promise<IServiceRequest | null> => {
  const rejector = await userDAO.findById(rejectedBy);
  const serviceRequest = await serviceRequestDAO.findById(requestId);
  
  if (!serviceRequest) {
    throw new Error('Service request not found');
  }

  // Add timeline event for rejection
  const timelineEvent = {
    event: 'status_changed' as const,
    performedBy: rejectedBy as any,
    performedByName: rejector?.name || 'Unknown',
    timestamp: getCurrentIST(),
    details: 'Service request rejected',
    oldValue: serviceRequest.status,
    newValue: SERVICE_REQUEST_STATUS.REJECTED,
  };
  
  const currentTimeline = serviceRequest.timeline || [];
  const updatedRequest = await serviceRequestDAO.updateById(requestId, {
    status: SERVICE_REQUEST_STATUS.REJECTED,
    timeline: [...currentTimeline, timelineEvent],
  } as any);

  if (updatedRequest) {
    const creator = await userDAO.findById(serviceRequest.createdBy.toString());
    if (creator) {
      await sendStatusUpdateEmail(
        serviceRequest.requestId,
        SERVICE_REQUEST_STATUS.REJECTED,
        creator,
        'service_request'
      );
    }
  }

  return serviceRequest;
};

export const addComment = async (
  requestId: string,
  userId: string,
  text: string,
  userRole?: string
): Promise<IServiceRequest | null> => {
  const user = await userDAO.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  const serviceRequest = await serviceRequestDAO.findById(requestId);
  if (!serviceRequest) {
    throw new Error('Service request not found');
  }

  // Agents can only comment on service requests assigned to them
  if (userRole === ROLES.AGENT) {
    const assignedToId = serviceRequest.assignedTo?._id?.toString() || serviceRequest.assignedTo?.toString();
    if (assignedToId !== userId) {
      throw new Error('Access denied: You can only comment on service requests assigned to you');
    }
  }

  const result = await serviceRequestDAO.addComment(requestId, {
    user: userId,
    userName: user.name,
    text,
  });

  // Add timeline event for comment
  if (result) {
    const timelineEvent = {
      event: 'commented' as const,
      performedBy: userId as any,
      performedByName: user.name,
      timestamp: getCurrentIST(),
      details: 'Added a comment',
    };
    
    const currentTimeline = result.timeline || [];
    await serviceRequestDAO.updateById(requestId, { 
      timeline: [...currentTimeline, timelineEvent] 
    } as any);
  }

  return result;
};

export const assignServiceRequest = async (
  requestId: string,
  agentId: string,
  assignedBy: string
): Promise<IServiceRequest | null> => {
  const agent = await userDAO.findById(agentId);
  const assignedByUser = await userDAO.findById(assignedBy);
  
  if (!agent) {
    throw new Error('Agent not found');
  }

  if (agent.role !== ROLES.AGENT && agent.role !== ROLES.ADMIN) {
    throw new Error('Can only assign to agents or admins');
  }

  const serviceRequest = await serviceRequestDAO.findById(requestId);
  if (!serviceRequest) {
    throw new Error('Service request not found');
  }

  const wasAssigned = !!serviceRequest.assignedTo;
  const updatedRequest = await serviceRequestDAO.assignAgent(requestId, agentId);
  
  if (updatedRequest) {
    // Add timeline event
    const timelineEvent = {
      event: wasAssigned ? ('reassigned' as const) : ('assigned' as const),
      performedBy: assignedBy as any,
      performedByName: assignedByUser?.name || 'Admin',
      timestamp: getCurrentIST(),
      details: `Service request ${wasAssigned ? 'reassigned' : 'assigned'} to ${agent.name}`,
      newValue: agent.name,
    };
    
    const currentTimeline = updatedRequest.timeline || [];
    await serviceRequestDAO.updateById(requestId, { 
      timeline: [...currentTimeline, timelineEvent] 
    } as any);
    
    await sendAssignmentEmail(updatedRequest.requestId, agent, 'service_request');
  }

  return updatedRequest;
};

export const getServiceRequestStats = async (): Promise<any> => {
  const [statusStats, totalCount] = await Promise.all([
    serviceRequestDAO.getStatsByStatus(),
    serviceRequestDAO.count({}),
  ]);

  return {
    total: totalCount,
    byStatus: statusStats,
  };
};

export const serviceRequestService = {
  createServiceRequest,
  getServiceRequestById,
  getServiceRequestByRequestId,
  getUserServiceRequests,
  countUserServiceRequests,
  getAssignedServiceRequests,
  countAssignedServiceRequests,
  getAllServiceRequests,
  countAllServiceRequests,
  updateServiceRequest,
  approveServiceRequest,
  rejectServiceRequest,
  addComment,
  assignServiceRequest,
  getServiceRequestStats,
};
