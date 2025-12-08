"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.getAnalytics = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = exports.activateUser = exports.deactivateUser = exports.updateUser = exports.createUser = exports.getAgents = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const response_util_1 = require("../utils/response.util");
const validation_util_1 = require("../utils/validation.util");
const zod_1 = require("zod");
// User Management
const getUsers = async (req, res) => {
    try {
        const { role, isActive } = req.query;
        const filter = {};
        if (role)
            filter.role = role;
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        const users = await user_service_1.userService.getAllUsers(filter);
        res.status(200).json((0, response_util_1.successResponse)('Users retrieved', users));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get users'));
    }
};
exports.getUsers = getUsers;
const getAgents = async (req, res) => {
    try {
        const agents = await user_service_1.userService.getAllUsers({ role: 'agent', isActive: true });
        res.status(200).json((0, response_util_1.successResponse)('Agents retrieved', agents));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get agents'));
    }
};
exports.getAgents = getAgents;
const createUser = async (req, res) => {
    try {
        const validatedData = validation_util_1.createUserSchema.parse(req.body);
        const user = await user_service_1.userService.createUser(validatedData);
        res.status(201).json((0, response_util_1.successResponse)('User created successfully', user));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create user'));
        }
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = await user_service_1.userService.updateUser(id, updates);
        if (!user) {
            res.status(404).json((0, response_util_1.errorResponse)('User not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('User updated successfully', user));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update user'));
        }
    }
};
exports.updateUser = updateUser;
const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_service_1.userService.deactivateUser(id);
        if (!user) {
            res.status(404).json((0, response_util_1.errorResponse)('User not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('User deactivated successfully', user));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to deactivate user'));
    }
};
exports.deactivateUser = deactivateUser;
const activateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_service_1.userService.activateUser(id);
        if (!user) {
            res.status(404).json((0, response_util_1.errorResponse)('User not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('User activated successfully', user));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to activate user'));
    }
};
exports.activateUser = activateUser;
// Category Management
const getCategories = async (req, res) => {
    try {
        const { type } = req.query;
        const categories = await user_service_1.categoryService.getAllCategories(type);
        res.status(200).json((0, response_util_1.successResponse)('Categories retrieved', categories));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get categories'));
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const validatedData = validation_util_1.createCategorySchema.parse(req.body);
        const category = await user_service_1.categoryService.createCategory(validatedData);
        res.status(201).json((0, response_util_1.successResponse)('Category created successfully', category));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create category'));
        }
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const category = await user_service_1.categoryService.updateCategory(id, updates);
        if (!category) {
            res.status(404).json((0, response_util_1.errorResponse)('Category not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Category updated successfully', category));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update category'));
        }
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await user_service_1.categoryService.deleteCategory(id);
        if (!deleted) {
            res.status(404).json((0, response_util_1.errorResponse)('Category not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Category deleted successfully'));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to delete category'));
    }
};
exports.deleteCategory = deleteCategory;
// Analytics
const getAnalytics = async (req, res) => {
    try {
        const analytics = await user_service_1.userService.getAnalytics();
        res.status(200).json((0, response_util_1.successResponse)('Analytics retrieved', analytics));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get analytics'));
    }
};
exports.getAnalytics = getAnalytics;
exports.adminController = {
    getUsers: exports.getUsers,
    getAgents: exports.getAgents,
    createUser: exports.createUser,
    updateUser: exports.updateUser,
    deactivateUser: exports.deactivateUser,
    activateUser: exports.activateUser,
    getCategories: exports.getCategories,
    createCategory: exports.createCategory,
    updateCategory: exports.updateCategory,
    deleteCategory: exports.deleteCategory,
    getAnalytics: exports.getAnalytics,
};
//# sourceMappingURL=admin.controller.js.map