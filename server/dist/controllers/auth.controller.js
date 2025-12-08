"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.updatePassword = exports.updateProfile = exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const auth_service_1 = require("../services/auth.service");
const response_util_1 = require("../utils/response.util");
const validation_util_1 = require("../utils/validation.util");
const zod_1 = require("zod");
const signup = async (req, res) => {
    try {
        const validatedData = validation_util_1.signupSchema.parse(req.body);
        const { user, token } = await auth_service_1.authService.signup(validatedData);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax',
        });
        res.status(201).json((0, response_util_1.successResponse)('Signup successful', {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                department: user.department,
            },
        }));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Signup failed'));
        }
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const validatedData = validation_util_1.loginSchema.parse(req.body);
        const { user, token } = await auth_service_1.authService.login(validatedData.email, validatedData.password);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
        });
        res.status(200).json((0, response_util_1.successResponse)('Login successful', {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                department: user.department,
            },
        }));
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json((0, response_util_1.errorResponse)('Validation error', error.errors));
        }
        else if (error instanceof Error) {
            res.status(401).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Login failed'));
        }
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json((0, response_util_1.successResponse)('Logout successful'));
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const user = await auth_service_1.authService.getMe(req.userId);
        if (!user) {
            res.status(404).json((0, response_util_1.errorResponse)('User not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('User retrieved', {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
            isActive: user.isActive,
        }));
    }
    catch (error) {
        if (error instanceof Error && error.message.includes('deactivated')) {
            res.status(403).json({
                success: false,
                message: error.message,
                code: 'ACCOUNT_INACTIVE',
            });
            return;
        }
        res.status(500).json((0, response_util_1.errorResponse)('Failed to get user'));
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { name } = req.body;
        if (!name || !name.trim()) {
            res.status(400).json((0, response_util_1.errorResponse)('Name is required'));
            return;
        }
        // Email should not be allowed to be updated
        if (req.body.email) {
            res.status(400).json((0, response_util_1.errorResponse)('Email cannot be updated'));
            return;
        }
        const user = await auth_service_1.authService.updateProfile(req.userId, { name: name.trim() });
        if (!user) {
            res.status(404).json((0, response_util_1.errorResponse)('User not found'));
            return;
        }
        res.status(200).json((0, response_util_1.successResponse)('Profile updated successfully', {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
        }));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update profile'));
        }
    }
};
exports.updateProfile = updateProfile;
const updatePassword = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required'));
            return;
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json((0, response_util_1.errorResponse)('Current password and new password are required'));
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json((0, response_util_1.errorResponse)('Password must be at least 6 characters'));
            return;
        }
        await auth_service_1.authService.updatePassword(req.userId, currentPassword, newPassword);
        res.status(200).json((0, response_util_1.successResponse)('Password updated successfully'));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message));
        }
        else {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update password'));
        }
    }
};
exports.updatePassword = updatePassword;
exports.authController = {
    signup: exports.signup,
    login: exports.login,
    logout: exports.logout,
    getMe: exports.getMe,
    updateProfile: exports.updateProfile,
    updatePassword: exports.updatePassword,
};
//# sourceMappingURL=auth.controller.js.map