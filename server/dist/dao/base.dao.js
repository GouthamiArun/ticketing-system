"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseDAO = void 0;
const createBaseDAO = (model) => {
    const create = async (data) => {
        const document = await model.create(data);
        return document;
    };
    const findById = async (id, populate) => {
        let query = model.findById(id);
        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach((path) => {
                    query = query.populate(path);
                });
            }
            else {
                query = query.populate(populate);
            }
        }
        return await query.exec();
    };
    const findOne = async (filter, populate) => {
        let query = model.findOne(filter);
        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach((path) => {
                    query = query.populate(path);
                });
            }
            else {
                query = query.populate(populate);
            }
        }
        return await query.exec();
    };
    const findAll = async (filter = {}, options) => {
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
            }
            else {
                query = query.populate(options.populate);
            }
        }
        return await query.exec();
    };
    const updateById = async (id, data, options) => {
        return await model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
            ...options,
        });
    };
    const updateOne = async (filter, data, options) => {
        return await model.findOneAndUpdate(filter, data, {
            new: true,
            runValidators: true,
            ...options,
        });
    };
    const deleteById = async (id) => {
        const result = await model.findByIdAndDelete(id);
        return result !== null;
    };
    const deleteOne = async (filter) => {
        const result = await model.findOneAndDelete(filter);
        return result !== null;
    };
    const count = async (filter = {}) => {
        return await model.countDocuments(filter);
    };
    const exists = async (filter) => {
        const count = await model.countDocuments(filter).limit(1);
        return count > 0;
    };
    const aggregate = async (pipeline) => {
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
exports.createBaseDAO = createBaseDAO;
//# sourceMappingURL=base.dao.js.map