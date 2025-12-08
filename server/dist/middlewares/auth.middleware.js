"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const auth_service_1 = require("../services/auth.service");
const user_dao_1 = require("../dao/user.dao");
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }
        const decoded = auth_service_1.authService.verifyToken(token);
        // Fetch user from database to verify active status
        const user = await user_dao_1.userDAO.findById(decoded.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Check if user account is active
        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact administrator.',
                code: 'ACCOUNT_INACTIVE',
            });
            return;
        }
        req.userId = decoded.userId;
        req.user = user;
        req.userRole = user.role;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map