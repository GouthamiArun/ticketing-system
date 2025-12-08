"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.verifyToken = exports.updatePassword = exports.updateProfile = exports.getMe = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_dao_1 = require("../dao/user.dao");
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn });
};
const signup = async (data) => {
    const existingUser = await user_dao_1.userDAO.findByEmail(data.email);
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    const user = await user_dao_1.userDAO.create(data);
    const token = generateToken(user._id.toString());
    return { user, token };
};
exports.signup = signup;
const login = async (email, password) => {
    const user = await user_dao_1.userDAO.findByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    if (!user.isActive) {
        throw new Error('Your account has been deactivated');
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    const token = generateToken(user._id.toString());
    return { user, token };
};
exports.login = login;
const getMe = async (userId) => {
    const user = await user_dao_1.userDAO.findById(userId);
    if (user && !user.isActive) {
        throw new Error('Your account has been deactivated');
    }
    return user;
};
exports.getMe = getMe;
const updateProfile = async (userId, data) => {
    const user = await user_dao_1.userDAO.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Only allow updating name, email should not be updated
    const updatedUser = await user_dao_1.userDAO.updateById(userId, { name: data.name });
    return updatedUser;
};
exports.updateProfile = updateProfile;
const updatePassword = async (userId, currentPassword, newPassword) => {
    const user = await user_dao_1.userDAO.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }
    // Update password - the pre-save hook will hash it
    user.password = newPassword;
    await user.save();
};
exports.updatePassword = updatePassword;
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'default-secret';
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
exports.authService = {
    signup: exports.signup,
    login: exports.login,
    getMe: exports.getMe,
    updateProfile: exports.updateProfile,
    updatePassword: exports.updatePassword,
    verifyToken: exports.verifyToken,
};
//# sourceMappingURL=auth.service.js.map