import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const getUsers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAgents: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deactivateUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const activateUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCategories: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAnalytics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const adminController: {
    getUsers: (req: AuthRequest, res: Response) => Promise<void>;
    getAgents: (req: AuthRequest, res: Response) => Promise<void>;
    createUser: (req: AuthRequest, res: Response) => Promise<void>;
    updateUser: (req: AuthRequest, res: Response) => Promise<void>;
    deactivateUser: (req: AuthRequest, res: Response) => Promise<void>;
    activateUser: (req: AuthRequest, res: Response) => Promise<void>;
    getCategories: (req: AuthRequest, res: Response) => Promise<void>;
    createCategory: (req: AuthRequest, res: Response) => Promise<void>;
    updateCategory: (req: AuthRequest, res: Response) => Promise<void>;
    deleteCategory: (req: AuthRequest, res: Response) => Promise<void>;
    getAnalytics: (req: AuthRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=admin.controller.d.ts.map