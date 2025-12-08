import { ICategory } from '../models/Category.model';
export declare const findByType: (type: string) => Promise<ICategory[]>;
export declare const findByName: (name: string, type: string) => Promise<ICategory | null>;
export declare const addSubcategory: (categoryId: string, subcategory: string) => Promise<ICategory | null>;
export declare const removeSubcategory: (categoryId: string, subcategory: string) => Promise<ICategory | null>;
export declare const getActiveCategories: () => Promise<ICategory[]>;
export declare const categoryDAO: {
    findByType: (type: string) => Promise<ICategory[]>;
    findByName: (name: string, type: string) => Promise<ICategory | null>;
    addSubcategory: (categoryId: string, subcategory: string) => Promise<ICategory | null>;
    removeSubcategory: (categoryId: string, subcategory: string) => Promise<ICategory | null>;
    getActiveCategories: () => Promise<ICategory[]>;
    create: (data: Partial<ICategory>) => Promise<ICategory>;
    findById: (id: string, populate?: string | string[]) => Promise<ICategory | null>;
    findOne: (filter: import("mongoose").FilterQuery<ICategory>, populate?: string | string[]) => Promise<ICategory | null>;
    findAll: (filter?: import("mongoose").FilterQuery<ICategory> | undefined, options?: any) => Promise<ICategory[]>;
    updateById: (id: string, data: import("mongoose").UpdateQuery<ICategory>, options?: import("mongoose").QueryOptions) => Promise<ICategory | null>;
    updateOne: (filter: import("mongoose").FilterQuery<ICategory>, data: import("mongoose").UpdateQuery<ICategory>, options?: import("mongoose").QueryOptions) => Promise<ICategory | null>;
    deleteById: (id: string) => Promise<boolean>;
    deleteOne: (filter: import("mongoose").FilterQuery<ICategory>) => Promise<boolean>;
    count: (filter?: import("mongoose").FilterQuery<ICategory> | undefined) => Promise<number>;
    exists: (filter: import("mongoose").FilterQuery<ICategory>) => Promise<boolean>;
    aggregate: (pipeline: any[]) => Promise<any[]>;
};
//# sourceMappingURL=category.dao.d.ts.map