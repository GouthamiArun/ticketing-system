import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePassword: (req: AuthRequest, res: Response) => Promise<void>;
export declare const authController: {
    signup: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
    getMe: (req: AuthRequest, res: Response) => Promise<void>;
    updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
    updatePassword: (req: AuthRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map