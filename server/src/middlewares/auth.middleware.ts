import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { userDAO } from '../dao/user.dao';

export interface AuthRequest extends Request {
  user?: any;
  userId?: string;
  userRole?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = authService.verifyToken(token);
    
    // Fetch user from database to verify active status
    const user = await userDAO.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Check if user account is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.',
        code: 'ACCOUNT_INACTIVE',
      });
      return;
    }
    
    req.userId = decoded.userId;
    req.user = user;
    req.userRole = user.role;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
