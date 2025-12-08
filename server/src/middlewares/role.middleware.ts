import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { userDAO } from '../dao/user.dao';
import { ROLES } from '../config/constants';

export const requireRole = (...allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const user = await userDAO.findById(req.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }
      
      // Double-check user is active (security layer)
      if (!user.isActive) {
        res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact administrator.',
          code: 'ACCOUNT_INACTIVE',
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Authorization check failed',
      });
    }
  };
};

export const requireEmployee = requireRole(ROLES.EMPLOYEE, ROLES.AGENT, ROLES.ADMIN);
export const requireAgent = requireRole(ROLES.AGENT, ROLES.ADMIN);
export const requireAdmin = requireRole(ROLES.ADMIN);
