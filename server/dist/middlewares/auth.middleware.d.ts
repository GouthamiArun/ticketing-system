import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: any;
    userId?: string;
    userRole?: string;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map