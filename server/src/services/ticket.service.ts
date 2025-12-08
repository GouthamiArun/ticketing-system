import { ticketDAO } from '../dao/ticket.dao';
import { userDAO } from '../dao/user.dao';
import { ITicket } from '../models/Ticket.model';
import { TICKET_STATUS, ROLES } from '../config/constants';
import {
  sendTicketCreatedEmail,
  sendAssignmentEmail,
  sendStatusUpdateEmail,
} from '../utils/email.util';
import { getCurrentIST } from '../utils/date.util';

export const createTicket = async (
  userId: string,
  data: {
    type: string;
    category: string;
    subcategory: string;
    description: string;
    priority: string;
    attachments?: string[];
  }
): Promise<ITicket> => {
  const user = await userDAO.findById(userId);
  
  const ticket = await ticketDAO.create({
    ...data,
    createdBy: userId as any,
    status: TICKET_STATUS.OPEN,
    timeline: [{
      event: 'created',
      performedBy: userId as any,
      performedByName: user?.name || 'Unknown',
      timestamp: getCurrentIST(),
      details: `Ticket created with priority: ${data.priority}`,
    }],
  } as any);

  // Send email notification to creator
  if (user) {
    await sendTicketCreatedEmail(ticket, user);
  }

  return ticket;
};

export const getTicketById = async (
  ticketId: string,
  userId?: string,
  userRole?: string
): Promise<ITicket | null> => {
  const ticket = await ticketDAO.findById(ticketId, ['createdBy', 'assignedTo', 'comments.user']);
  
  if (!ticket) {
    return null;
  }

  // Agents can only view tickets assigned to them
  if (userRole === ROLES.AGENT && userId) {
    const assignedToId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();
    if (assignedToId !== userId) {
      throw new Error('Access denied: You can only view tickets assigned to you');
    }
  }

  return ticket;
};

export const getTicketByTicketId = async (ticketId: string): Promise<ITicket | null> => {
  return await ticketDAO.findByTicketId(ticketId);
};

export const getUserTickets = async (
  userId: string,
  filters?: any,
  skip?: number,
  limit?: number,
  sort?: any
): Promise<ITicket[]> => {
  const options: any = {
    sort: sort || { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
  };
  if (skip !== undefined) options.skip = skip;
  if (limit !== undefined) options.limit = limit;

  const query: any = { createdBy: userId, ...filters };
  return await ticketDAO.findAll(query, options);
};

export const countUserTickets = async (userId: string, filters?: any): Promise<number> => {
  const query: any = { createdBy: userId, ...filters };
  return await ticketDAO.count(query);
};

export const getAssignedTickets = async (
  agentId: string,
  filters?: any,
  skip?: number,
  limit?: number,
  sort?: any
): Promise<ITicket[]> => {
  const options: any = {
    sort: sort || { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
  };
  if (skip !== undefined) options.skip = skip;
  if (limit !== undefined) options.limit = limit;

  const query: any = { assignedTo: agentId, ...filters };
  return await ticketDAO.findAll(query, options);
};

export const countAssignedTickets = async (agentId: string, filters?: any): Promise<number> => {
  const query: any = { assignedTo: agentId, ...filters };
  return await ticketDAO.count(query);
};

export const getAllTickets = async (
  filters?: any,
  skip?: number,
  limit?: number,
  sort?: any
): Promise<ITicket[]> => {
  const options: any = {
    sort: sort || { createdAt: -1 },
    populate: ['createdBy', 'assignedTo'],
  };
  if (skip !== undefined) options.skip = skip;
  if (limit !== undefined) options.limit = limit;

  if (filters) {
    return await ticketDAO.findWithFilters(filters, options);
  }
  return await ticketDAO.findAll({}, options);
};

export const countAllTickets = async (filters?: any): Promise<number> => {
  return await ticketDAO.count(filters || {});
};

export const updateTicket = async (
  ticketId: string,
  updates: Partial<ITicket>,
  userId: string,
  userRole?: string
): Promise<ITicket | null> => {
  const ticket = await ticketDAO.findById(ticketId);
  
  if (!ticket) {
    throw new Error('Ticket not found');
  }

  // Agents can only update tickets assigned to them
  if (userRole === ROLES.AGENT) {
    const assignedToId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();
    if (assignedToId !== userId) {
      throw new Error('Access denied: You can only update tickets assigned to you');
    }
  }

  const oldStatus = ticket.status;
  const user = await userDAO.findById(userId);
  
  // Add timeline event for status change
  if (updates.status && updates.status !== oldStatus) {
    const timelineEvent = {
      event: updates.status === TICKET_STATUS.RESOLVED ? 'resolved' as const : 
             updates.status === TICKET_STATUS.CLOSED ? 'closed' as const : 'status_changed' as const,
      performedBy: userId as any,
      performedByName: user?.name || 'Unknown',
      timestamp: getCurrentIST(),
      details: `Status changed from ${oldStatus} to ${updates.status}`,
      oldValue: oldStatus,
      newValue: updates.status,
    };
    
    const currentTimeline = ticket.timeline || [];
    updates.timeline = [...currentTimeline, timelineEvent] as any;
  }
  
  const updatedTicket = await ticketDAO.updateById(ticketId, updates as any);

  // Send email if status changed
  if (updates.status && updates.status !== oldStatus && updatedTicket) {
    const creator = await userDAO.findById(ticket.createdBy.toString());
    if (creator) {
      await sendStatusUpdateEmail(ticket.ticketId, updates.status, creator, 'ticket');
    }
  }

  return updatedTicket;
};

export const addComment = async (
  ticketId: string,
  userId: string,
  text: string,
  attachments?: string[],
  userRole?: string
): Promise<ITicket | null> => {
  const user = await userDAO.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  const ticket = await ticketDAO.findById(ticketId);
  if (!ticket) {
    throw new Error('Ticket not found');
  }

  // Agents can only comment on tickets assigned to them
  if (userRole === ROLES.AGENT) {
    const assignedToId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();
    if (assignedToId !== userId) {
      throw new Error('Access denied: You can only comment on tickets assigned to you');
    }
  }

  const result = await ticketDAO.addComment(ticketId, {
    user: userId,
    userName: user.name,
    text,
    attachments: attachments || [],
  });

  // Add timeline event for comment
  if (result) {
    const timelineEvent = {
      event: 'commented' as const,
      performedBy: userId as any,
      performedByName: user.name,
      timestamp: getCurrentIST(),
      details: `Added a comment${attachments && attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ''}`,
    };
    
    const currentTimeline = result.timeline || [];
    await ticketDAO.updateById(ticketId, { 
      timeline: [...currentTimeline, timelineEvent] 
    } as any);
  }

  return result;
};

export const assignTicket = async (ticketId: string, agentId: string, assignedBy: string): Promise<ITicket | null> => {
  const agent = await userDAO.findById(agentId);
  const assignedByUser = await userDAO.findById(assignedBy);
  
  if (!agent) {
    throw new Error('Agent not found');
  }

  if (agent.role !== ROLES.AGENT && agent.role !== ROLES.ADMIN) {
    throw new Error('Can only assign to agents or admins');
  }

  const ticket = await ticketDAO.findById(ticketId);
  if (!ticket) {
    throw new Error('Ticket not found');
  }

  const wasAssigned = !!ticket.assignedTo;
  const updatedTicket = await ticketDAO.assignAgent(ticketId, agentId);
  
  if (updatedTicket) {
    // Add timeline event
    const timelineEvent = {
      event: wasAssigned ? ('reassigned' as const) : ('assigned' as const),
      performedBy: assignedBy as any,
      performedByName: assignedByUser?.name || 'Admin',
      timestamp: getCurrentIST(),
      details: `Ticket ${wasAssigned ? 'reassigned' : 'assigned'} to ${agent.name}`,
      newValue: agent.name,
    };
    
    const currentTimeline = updatedTicket.timeline || [];
    await ticketDAO.updateById(ticketId, { 
      timeline: [...currentTimeline, timelineEvent] 
    } as any);
    
    await sendAssignmentEmail(updatedTicket.ticketId, agent, 'ticket');
  }

  return updatedTicket;
};

export const getTicketStats = async (): Promise<any> => {
  const [statusStats, priorityStats, totalCount] = await Promise.all([
    ticketDAO.getStatsByStatus(),
    ticketDAO.getStatsByPriority(),
    ticketDAO.count({}),
  ]);

  return {
    total: totalCount,
    byStatus: statusStats,
    byPriority: priorityStats,
  };
};

export const markAsResolved = async (ticketId: string, userId: string): Promise<ITicket | null> => {
  const ticket = await ticketDAO.findById(ticketId);
  
  if (!ticket) {
    throw new Error('Ticket not found');
  }

  const updatedTicket = await ticketDAO.updateById(ticketId, {
    status: TICKET_STATUS.RESOLVED,
  } as any);

  // Send email notification
  if (updatedTicket) {
    const creator = await userDAO.findById(ticket.createdBy.toString());
    if (creator) {
      await sendStatusUpdateEmail(ticket.ticketId, TICKET_STATUS.RESOLVED, creator, 'ticket');
    }
  }

  return updatedTicket;
};

export const ticketService = {
  createTicket,
  getTicketById,
  getTicketByTicketId,
  getUserTickets,
  countUserTickets,
  getAssignedTickets,
  countAssignedTickets,
  getAllTickets,
  countAllTickets,
  updateTicket,
  addComment,
  assignTicket,
  getTicketStats,
  markAsResolved,
};
