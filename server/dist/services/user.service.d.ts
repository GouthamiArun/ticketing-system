import { IUser } from '../models/User.model';
import { ICategory } from '../models/Category.model';
export declare const getAllUsers: (filter?: any) => Promise<IUser[]>;
export declare const getUserById: (userId: string) => Promise<IUser | null>;
export declare const createUser: (data: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
}) => Promise<IUser>;
export declare const updateUser: (userId: string, updates: Partial<IUser>) => Promise<IUser | null>;
export declare const deactivateUser: (userId: string) => Promise<IUser | null>;
export declare const activateUser: (userId: string) => Promise<IUser | null>;
export declare const getUsersByRole: (role: string) => Promise<IUser[]>;
export declare const getAnalytics: () => Promise<any>;
export declare const userService: {
    getAllUsers: (filter?: any) => Promise<IUser[]>;
    getUserById: (userId: string) => Promise<IUser | null>;
    createUser: (data: {
        email: string;
        password: string;
        name: string;
        role: string;
        department?: string;
    }) => Promise<IUser>;
    updateUser: (userId: string, updates: Partial<IUser>) => Promise<IUser | null>;
    deactivateUser: (userId: string) => Promise<IUser | null>;
    activateUser: (userId: string) => Promise<IUser | null>;
    getUsersByRole: (role: string) => Promise<IUser[]>;
    getAnalytics: () => Promise<any>;
};
export declare const getAllCategories: (type?: string) => Promise<ICategory[]>;
export declare const getCategoryById: (categoryId: string) => Promise<ICategory | null>;
export declare const createCategory: (data: {
    name: string;
    type: string;
    subcategories?: string[];
}) => Promise<ICategory>;
export declare const updateCategory: (categoryId: string, updates: Partial<ICategory>) => Promise<ICategory | null>;
export declare const deleteCategory: (categoryId: string) => Promise<boolean>;
export declare const addSubcategory: (categoryId: string, subcategory: string) => Promise<ICategory | null>;
export declare const removeSubcategory: (categoryId: string, subcategory: string) => Promise<ICategory | null>;
export declare const categoryService: {
    getAllCategories: (type?: string) => Promise<ICategory[]>;
    getCategoryById: (categoryId: string) => Promise<ICategory | null>;
    createCategory: (data: {
        name: string;
        type: string;
        subcategories?: string[];
    }) => Promise<ICategory>;
    updateCategory: (categoryId: string, updates: Partial<ICategory>) => Promise<ICategory | null>;
    deleteCategory: (categoryId: string) => Promise<boolean>;
    addSubcategory: (categoryId: string, subcategory: string) => Promise<ICategory | null>;
    removeSubcategory: (categoryId: string, subcategory: string) => Promise<ICategory | null>;
};
//# sourceMappingURL=user.service.d.ts.map