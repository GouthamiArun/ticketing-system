import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
export declare const requireRole: (...allowedRoles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireEmployee: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAgent: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=role.middleware.d.ts.map