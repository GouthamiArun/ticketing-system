import { IUser } from '../models/User.model';
export declare const findByEmail: (email: string) => Promise<IUser | null>;
export declare const findActiveAgents: () => Promise<IUser[]>;
export declare const findByRole: (role: string) => Promise<IUser[]>;
export declare const deactivateUser: (id: string) => Promise<IUser | null>;
export declare const activateUser: (id: string) => Promise<IUser | null>;
export declare const updatePassword: (id: string, newPassword: string) => Promise<IUser | null>;
export declare const userDAO: {
    findByEmail: (email: string) => Promise<IUser | null>;
    findActiveAgents: () => Promise<IUser[]>;
    findByRole: (role: string) => Promise<IUser[]>;
    deactivateUser: (id: string) => Promise<IUser | null>;
    activateUser: (id: string) => Promise<IUser | null>;
    updatePassword: (id: string, newPassword: string) => Promise<IUser | null>;
    create: (data: Partial<IUser>) => Promise<IUser>;
    findById: (id: string, populate?: string | string[]) => Promise<IUser | null>;
    findOne: (filter: import("mongoose").FilterQuery<IUser>, populate?: string | string[]) => Promise<IUser | null>;
    findAll: (filter?: import("mongoose").FilterQuery<IUser> | undefined, options?: any) => Promise<IUser[]>;
    updateById: (id: string, data: import("mongoose").UpdateQuery<IUser>, options?: import("mongoose").QueryOptions) => Promise<IUser | null>;
    updateOne: (filter: import("mongoose").FilterQuery<IUser>, data: import("mongoose").UpdateQuery<IUser>, options?: import("mongoose").QueryOptions) => Promise<IUser | null>;
    deleteById: (id: string) => Promise<boolean>;
    deleteOne: (filter: import("mongoose").FilterQuery<IUser>) => Promise<boolean>;
    count: (filter?: import("mongoose").FilterQuery<IUser> | undefined) => Promise<number>;
    exists: (filter: import("mongoose").FilterQuery<IUser>) => Promise<boolean>;
    aggregate: (pipeline: any[]) => Promise<any[]>;
};
//# sourceMappingURL=user.dao.d.ts.map