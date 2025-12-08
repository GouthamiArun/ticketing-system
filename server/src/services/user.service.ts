import { userDAO } from '../dao/user.dao';
import { categoryDAO } from '../dao/category.dao';
import { ticketDAO } from '../dao/ticket.dao';
import { serviceRequestDAO } from '../dao/serviceRequest.dao';
import { IUser } from '../models/User.model';
import { ICategory } from '../models/Category.model';
import { ROLES } from '../config/constants';

// User Service Functions
export const getAllUsers = async (filter?: any): Promise<IUser[]> => {
  return await userDAO.findAll(filter || {}, { sort: { createdAt: -1 } });
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await userDAO.findById(userId);
};

export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
  role: string;
  department?: string;
}): Promise<IUser> => {
  const existingUser = await userDAO.findByEmail(data.email);
  
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  return await userDAO.create(data as any);
};

export const updateUser = async (userId: string, updates: Partial<IUser>): Promise<IUser | null> => {
  // Don't allow password update through this method
  if (updates.password) {
    delete updates.password;
  }

  return await userDAO.updateById(userId, updates as any);
};

export const deactivateUser = async (userId: string): Promise<IUser | null> => {
  return await userDAO.deactivateUser(userId);
};

export const activateUser = async (userId: string): Promise<IUser | null> => {
  return await userDAO.activateUser(userId);
};

export const getUsersByRole = async (role: string): Promise<IUser[]> => {
  return await userDAO.findByRole(role);
};

export const getAnalytics = async (): Promise<any> => {
  const [
    totalUsers,
    totalTickets,
    totalServiceRequests,
    ticketStats,
    serviceRequestStats,
    usersByRole,
  ] = await Promise.all([
    userDAO.count({}),
    ticketDAO.count({}),
    serviceRequestDAO.count({}),
    ticketDAO.getStatsByStatus(),
    serviceRequestDAO.getStatsByStatus(),
    Promise.all([
      userDAO.count({ role: ROLES.EMPLOYEE }),
      userDAO.count({ role: ROLES.AGENT }),
      userDAO.count({ role: ROLES.ADMIN }),
    ]),
  ]);

  return {
    users: {
      total: totalUsers,
      employees: usersByRole[0],
      agents: usersByRole[1],
      admins: usersByRole[2],
    },
    tickets: {
      total: totalTickets,
      byStatus: ticketStats,
    },
    serviceRequests: {
      total: totalServiceRequests,
      byStatus: serviceRequestStats,
    },
  };
};

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
  getUsersByRole,
  getAnalytics,
};

// Category Service Functions
export const getAllCategories = async (type?: string): Promise<ICategory[]> => {
  if (type) {
    return await categoryDAO.findByType(type);
  }
  return await categoryDAO.getActiveCategories();
};

export const getCategoryById = async (categoryId: string): Promise<ICategory | null> => {
  return await categoryDAO.findById(categoryId);
};

export const createCategory = async (data: {
  name: string;
  type: string;
  subcategories?: string[];
}): Promise<ICategory> => {
  const existing = await categoryDAO.findByName(data.name, data.type);
  
  if (existing) {
    throw new Error('Category already exists with this name and type');
  }

  return await categoryDAO.create(data as any);
};

export const updateCategory = async (
  categoryId: string,
  updates: Partial<ICategory>
): Promise<ICategory | null> => {
  return await categoryDAO.updateById(categoryId, updates as any);
};

export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  return await categoryDAO.deleteById(categoryId);
};

export const addSubcategory = async (categoryId: string, subcategory: string): Promise<ICategory | null> => {
  return await categoryDAO.addSubcategory(categoryId, subcategory);
};

export const removeSubcategory = async (
  categoryId: string,
  subcategory: string
): Promise<ICategory | null> => {
  return await categoryDAO.removeSubcategory(categoryId, subcategory);
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
};
