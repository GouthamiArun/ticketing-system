"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDAO = exports.updatePassword = exports.activateUser = exports.deactivateUser = exports.findByRole = exports.findActiveAgents = exports.findByEmail = void 0;
const base_dao_1 = require("./base.dao");
const User_model_1 = require("../models/User.model");
const constants_1 = require("../config/constants");
const baseDAO = (0, base_dao_1.createBaseDAO)(User_model_1.User);
const findByEmail = async (email) => {
    return await User_model_1.User.findOne({ email }).select('+password');
};
exports.findByEmail = findByEmail;
const findActiveAgents = async () => {
    return await baseDAO.findAll({
        role: { $in: [constants_1.ROLES.AGENT, constants_1.ROLES.ADMIN] },
        isActive: true,
    });
};
exports.findActiveAgents = findActiveAgents;
const findByRole = async (role) => {
    return await baseDAO.findAll({ role, isActive: true });
};
exports.findByRole = findByRole;
const deactivateUser = async (id) => {
    return await baseDAO.updateById(id, { isActive: false });
};
exports.deactivateUser = deactivateUser;
const activateUser = async (id) => {
    return await baseDAO.updateById(id, { isActive: true });
};
exports.activateUser = activateUser;
const updatePassword = async (id, newPassword) => {
    const user = await User_model_1.User.findById(id).select('+password');
    if (!user)
        return null;
    user.password = newPassword;
    await user.save();
    return user;
};
exports.updatePassword = updatePassword;
exports.userDAO = {
    ...baseDAO,
    findByEmail: exports.findByEmail,
    findActiveAgents: exports.findActiveAgents,
    findByRole: exports.findByRole,
    deactivateUser: exports.deactivateUser,
    activateUser: exports.activateUser,
    updatePassword: exports.updatePassword,
};
//# sourceMappingURL=user.dao.js.map