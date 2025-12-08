import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
export interface BaseDAOFunctions<T extends Document> {
    create: (data: Partial<T>) => Promise<T>;
    findById: (id: string, populate?: string | string[]) => Promise<T | null>;
    findOne: (filter: FilterQuery<T>, populate?: string | string[]) => Promise<T | null>;
    findAll: (filter?: FilterQuery<T>, options?: any) => Promise<T[]>;
    updateById: (id: string, data: UpdateQuery<T>, options?: QueryOptions) => Promise<T | null>;
    updateOne: (filter: FilterQuery<T>, data: UpdateQuery<T>, options?: QueryOptions) => Promise<T | null>;
    deleteById: (id: string) => Promise<boolean>;
    deleteOne: (filter: FilterQuery<T>) => Promise<boolean>;
    count: (filter?: FilterQuery<T>) => Promise<number>;
    exists: (filter: FilterQuery<T>) => Promise<boolean>;
    aggregate: (pipeline: any[]) => Promise<any[]>;
}
export declare const createBaseDAO: <T extends Document>(model: Model<T>) => BaseDAOFunctions<T>;
//# sourceMappingURL=base.dao.d.ts.map