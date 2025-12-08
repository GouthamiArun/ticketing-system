"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryDAO = exports.getActiveCategories = exports.removeSubcategory = exports.addSubcategory = exports.findByName = exports.findByType = void 0;
const base_dao_1 = require("./base.dao");
const Category_model_1 = require("../models/Category.model");
const baseDAO = (0, base_dao_1.createBaseDAO)(Category_model_1.Category);
const findByType = async (type) => {
    return await baseDAO.findAll({ type, isActive: true });
};
exports.findByType = findByType;
const findByName = async (name, type) => {
    return await baseDAO.findOne({ name, type });
};
exports.findByName = findByName;
const addSubcategory = async (categoryId, subcategory) => {
    const category = await Category_model_1.Category.findById(categoryId);
    if (!category)
        return null;
    if (!category.subcategories.includes(subcategory)) {
        category.subcategories.push(subcategory);
        await category.save();
    }
    return category;
};
exports.addSubcategory = addSubcategory;
const removeSubcategory = async (categoryId, subcategory) => {
    const category = await Category_model_1.Category.findById(categoryId);
    if (!category)
        return null;
    category.subcategories = category.subcategories.filter((sub) => sub !== subcategory);
    await category.save();
    return category;
};
exports.removeSubcategory = removeSubcategory;
const getActiveCategories = async () => {
    return await baseDAO.findAll({ isActive: true }, { sort: { type: 1, name: 1 } });
};
exports.getActiveCategories = getActiveCategories;
exports.categoryDAO = {
    ...baseDAO,
    findByType: exports.findByType,
    findByName: exports.findByName,
    addSubcategory: exports.addSubcategory,
    removeSubcategory: exports.removeSubcategory,
    getActiveCategories: exports.getActiveCategories,
};
//# sourceMappingURL=category.dao.js.map