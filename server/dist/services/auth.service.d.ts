import { IUser } from '../models/User.model';
export declare const signup: (data: {
    email: string;
    password: string;
    name: string;
    department?: string;
}) => Promise<{
    user: IUser;
    token: string;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: IUser;
    token: string;
}>;
export declare const getMe: (userId: string) => Promise<IUser | null>;
export declare const updateProfile: (userId: string, data: {
    name: string;
}) => Promise<IUser | null>;
export declare const updatePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
export declare const verifyToken: (token: string) => any;
export declare const authService: {
    signup: (data: {
        email: string;
        password: string;
        name: string;
        department?: string;
    }) => Promise<{
        user: IUser;
        token: string;
    }>;
    login: (email: string, password: string) => Promise<{
        user: IUser;
        token: string;
    }>;
    getMe: (userId: string) => Promise<IUser | null>;
    updateProfile: (userId: string, data: {
        name: string;
    }) => Promise<IUser | null>;
    updatePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
    verifyToken: (token: string) => any;
};
//# sourceMappingURL=auth.service.d.ts.map