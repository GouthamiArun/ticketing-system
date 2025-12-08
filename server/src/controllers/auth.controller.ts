import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { signupSchema, loginSchema } from '../utils/validation.util';
import { ZodError } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = signupSchema.parse(req.body);
    
    const { user, token } = await authService.signup(validatedData);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    res.status(201).json(successResponse('Signup successful', {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    }));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Signup failed'));
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    const { user, token } = await authService.login(
      validatedData.email,
      validatedData.password
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.status(200).json(successResponse('Login successful', {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    }));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse('Validation error', error.errors));
    } else if (error instanceof Error) {
      res.status(401).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Login failed'));
    }
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.status(200).json(successResponse('Logout successful'));
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const user = await authService.getMe(req.userId);

    if (!user) {
      res.status(404).json(errorResponse('User not found'));
      return;
    }

    res.status(200).json(successResponse('User retrieved', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      isActive: user.isActive,
    }));
  } catch (error) {
    if (error instanceof Error && error.message.includes('deactivated')) {
      res.status(403).json({
        success: false,
        message: error.message,
        code: 'ACCOUNT_INACTIVE',
      });
      return;
    }
    res.status(500).json(errorResponse('Failed to get user'));
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json(errorResponse('Name is required'));
      return;
    }

    // Email should not be allowed to be updated
    if (req.body.email) {
      res.status(400).json(errorResponse('Email cannot be updated'));
      return;
    }

    const user = await authService.updateProfile(req.userId, { name: name.trim() });

    if (!user) {
      res.status(404).json(errorResponse('User not found'));
      return;
    }

    res.status(200).json(successResponse('Profile updated successfully', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
    }));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to update profile'));
    }
  }
};

export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json(errorResponse('Current password and new password are required'));
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json(errorResponse('Password must be at least 6 characters'));
      return;
    }

    await authService.updatePassword(req.userId, currentPassword, newPassword);

    res.status(200).json(successResponse('Password updated successfully'));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to update password'));
    }
  }
};

export const authController = {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
};
