"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.removeSubcategory = exports.addSubcategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = exports.userService = exports.getAnalytics = exports.getUsersByRole = exports.activateUser = exports.deactivateUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_dao_1 = require("../dao/user.dao");
const category_dao_1 = require("../dao/category.dao");
const ticket_dao_1 = require("../dao/ticket.dao");
const serviceRequest_dao_1 = require("../dao/serviceRequest.dao");
const constants_1 = require("../config/constants");
// User Service Functions
const getAllUsers = async (filter) => {
    return await user_dao_1.userDAO.findAll(filter || {}, { sort: { createdAt: -1 } });
};
exports.getAllUsers = getAllUsers;
const getUserById = async (userId) => {
    return await user_dao_1.userDAO.findById(userId);
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    const existingUser = await user_dao_1.userDAO.findByEmail(data.email);
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    return await user_dao_1.userDAO.create(data);
};
exports.createUser = createUser;
const updateUser = async (userId, updates) => {
    // Don't allow password update through this method
    if (updates.password) {
        delete updates.password;
    }
    return await user_dao_1.userDAO.updateById(userId, updates);
};
exports.updateUser = updateUser;
const deactivateUser = async (userId) => {
    return await user_dao_1.userDAO.deactivateUser(userId);
};
exports.deactivateUser = deactivateUser;
const activateUser = async (userId) => {
    return await user_dao_1.userDAO.activateUser(userId);
};
exports.activateUser = activateUser;
const getUsersByRole = async (role) => {
    return await user_dao_1.userDAO.findByRole(role);
};
exports.getUsersByRole = getUsersByRole;
const getAnalytics = async () => {
    const [totalUsers, totalTickets, totalServiceRequests, ticketStats, serviceRequestStats, usersByRole,] = await Promise.all([
        user_dao_1.userDAO.count({}),
        ticket_dao_1.ticketDAO.count({}),
        serviceRequest_dao_1.serviceRequestDAO.count({}),
        ticket_dao_1.ticketDAO.getStatsByStatus(),
        serviceRequest_dao_1.serviceRequestDAO.getStatsByStatus(),
        Promise.all([
            user_dao_1.userDAO.count({ role: constants_1.ROLES.EMPLOYEE }),
            user_dao_1.userDAO.count({ role: constants_1.ROLES.AGENT }),
            user_dao_1.userDAO.count({ role: constants_1.ROLES.ADMIN }),
        ]),
    ]);
    return {
        users: {
            total: totalUsers,
            employees: usersByRole[0],
            agents: usersByRole[1],
            admins: usersByRole[2],
        },
        tickets: {
            total: totalTickets,
            byStatus: ticketStats,
        },
        serviceRequests: {
            total: totalServiceRequests,
            byStatus: serviceRequestStats,
        },
    };
};
exports.getAnalytics = getAnalytics;
exports.userService = {
    getAllUsers: exports.getAllUsers,
    getUserById: exports.getUserById,
    createUser: exports.createUser,
    updateUser: exports.updateUser,
    deactivateUser: exports.deactivateUser,
    activateUser: exports.activateUser,
    getUsersByRole: exports.getUsersByRole,
    getAnalytics: exports.getAnalytics,
};
// Category Service Functions
const getAllCategories = async (type) => {
    if (type) {
        return await category_dao_1.categoryDAO.findByType(type);
    }
    return await category_dao_1.categoryDAO.getActiveCategories();
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (categoryId) => {
    return await category_dao_1.categoryDAO.findById(categoryId);
};
exports.getCategoryById = getCategoryById;
const createCategory = async (data) => {
    const existing = await category_dao_1.categoryDAO.findByName(data.name, data.type);
    if (existing) {
        throw new Error('Category already exists with this name and type');
    }
    return await category_dao_1.categoryDAO.create(data);
};
exports.createCategory = createCategory;
const updateCategory = async (categoryId, updates) => {
    return await category_dao_1.categoryDAO.updateById(categoryId, updates);
};
exports.updateCategory = updateCategory;
const deleteCategory = async (categoryId) => {
    return await category_dao_1.categoryDAO.deleteById(categoryId);
};
exports.deleteCategory = deleteCategory;
const addSubcategory = async (categoryId, subcategory) => {
    return await category_dao_1.categoryDAO.addSubcategory(categoryId, subcategory);
};
exports.addSubcategory = addSubcategory;
const removeSubcategory = async (categoryId, subcategory) => {
    return await category_dao_1.categoryDAO.removeSubcategory(categoryId, subcategory);
};
exports.removeSubcategory = removeSubcategory;
exports.categoryService = {
    getAllCategories: exports.getAllCategories,
    getCategoryById: exports.getCategoryById,
    createCategory: exports.createCategory,
    updateCategory: exports.updateCategory,
    deleteCategory: exports.deleteCategory,
    addSubcategory: exports.addSubcategory,
    removeSubcategory: exports.removeSubcategory,
};
//# sourceMappingURL=user.service.js.map