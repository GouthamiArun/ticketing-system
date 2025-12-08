import { Response } from 'express';
import { userService, categoryService } from '../services/user.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { createUserSchema, createCategorySchema } from '../utils/validation.util';
import { ZodError } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

// User Management
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, isActive } = req.query;
    const filter: any = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await userService.getAllUsers(filter);
    res.status(200).json(successResponse('Users retrieved', users));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get users'));
  }
};

export const getAgents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agents = await userService.getAllUsers({ role: 'agent', isActive: true });
    res.status(200).json(successResponse('Agents retrieved', agents));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get agents'));
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    
    const user = await userService.createUser(validatedData as any);
    res.status(201).json(successResponse('User created successfully', user));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to create user'));
    }
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await userService.updateUser(id, updates);

    if (!user) {
      res.status(404).json(errorResponse('User not found'));
      return;
    }

    res.status(200).json(successResponse('User updated successfully', user));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to update user'));
    }
  }
};

export const deactivateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await userService.deactivateUser(id);

    if (!user) {
      res.status(404).json(errorResponse('User not found'));
      return;
    }

    res.status(200).json(successResponse('User deactivated successfully', user));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to deactivate user'));
  }
};

export const activateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await userService.activateUser(id);

    if (!user) {
      res.status(404).json(errorResponse('User not found'));
      return;
    }

    res.status(200).json(successResponse('User activated successfully', user));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to activate user'));
  }
};

// Category Management
export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    
    const categories = await categoryService.getAllCategories(type as string);
    res.status(200).json(successResponse('Categories retrieved', categories));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get categories'));
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    
    const category = await categoryService.createCategory(validatedData as any);
    res.status(201).json(successResponse('Category created successfully', category));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to create category'));
    }
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await categoryService.updateCategory(id, updates);

    if (!category) {
      res.status(404).json(errorResponse('Category not found'));
      return;
    }

    res.status(200).json(successResponse('Category updated successfully', category));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to update category'));
    }
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await categoryService.deleteCategory(id);

    if (!deleted) {
      res.status(404).json(errorResponse('Category not found'));
      return;
    }

    res.status(200).json(successResponse('Category deleted successfully'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete category'));
  }
};

// Analytics
export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analytics = await userService.getAnalytics();
    res.status(200).json(successResponse('Analytics retrieved', analytics));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get analytics'));
  }
};

export const adminController = {
  getUsers,
  getAgents,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAnalytics,
};
