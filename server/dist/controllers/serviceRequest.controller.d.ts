import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const createServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getServiceRequests: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getServiceRequestById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const approveServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const rejectServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addComment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const assignServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const serviceRequestController: {
    createServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
    getServiceRequests: (req: AuthRequest, res: Response) => Promise<void>;
    getServiceRequestById: (req: AuthRequest, res: Response) => Promise<void>;
    updateServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
    approveServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
    rejectServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
    addComment: (req: AuthRequest, res: Response) => Promise<void>;
    assignServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
    getStats: (req: AuthRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=serviceRequest.controller.d.ts.map