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

export const createBaseDAO = <T extends Document>(model: Model<T>): BaseDAOFunctions<T> => {
  const create = async (data: Partial<T>): Promise<T> => {
    const document = await model.create(data);
    return document;
  };

  const findById = async (id: string, populate?: string | string[]): Promise<T | null> => {
    let query = model.findById(id);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((path) => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(populate);
      }
    }
    
    return await query.exec();
  };

  const findOne = async (
    filter: FilterQuery<T>,
    populate?: string | string[]
  ): Promise<T | null> => {
    let query = model.findOne(filter);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((path) => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(populate);
      }
    }
    
    return await query.exec();
  };

  const findAll = async (
    filter: FilterQuery<T> = {},
    options?: {
      sort?: any;
      limit?: number;
      skip?: number;
      populate?: string | string[];
      select?: string;
    }
  ): Promise<T[]> => {
    let query = model.find(filter);

    if (options?.sort) {
      query = query.sort(options.sort);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.skip) {
      query = query.skip(options.skip);
    }

    if (options?.select) {
      query = query.select(options.select);
    }

    if (options?.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach((path) => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(options.populate);
      }
    }

    return await query.exec();
  };

  const updateById = async (
    id: string,
    data: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<T | null> => {
    return await model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      ...options,
    });
  };

  const updateOne = async (
    filter: FilterQuery<T>,
    data: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<T | null> => {
    return await model.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
      ...options,
    });
  };

  const deleteById = async (id: string): Promise<boolean> => {
    const result = await model.findByIdAndDelete(id);
    return result !== null;
  };

  const deleteOne = async (filter: FilterQuery<T>): Promise<boolean> => {
    const result = await model.findOneAndDelete(filter);
    return result !== null;
  };

  const count = async (filter: FilterQuery<T> = {}): Promise<number> => {
    return await model.countDocuments(filter);
  };

  const exists = async (filter: FilterQuery<T>): Promise<boolean> => {
    const count = await model.countDocuments(filter).limit(1);
    return count > 0;
  };

  const aggregate = async (pipeline: any[]): Promise<any[]> => {
    return await model.aggregate(pipeline);
  };

  return {
    create,
    findById,
    findOne,
    findAll,
    updateById,
    updateOne,
    deleteById,
    deleteOne,
    count,
    exists,
    aggregate,
  };
};
