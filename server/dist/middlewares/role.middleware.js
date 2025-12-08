"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAgent = exports.requireEmployee = exports.requireRole = void 0;
const user_dao_1 = require("../dao/user.dao");
const constants_1 = require("../config/constants");
const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const user = await user_dao_1.userDAO.findById(req.userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
                return;
            }
            // Double-check user is active (security layer)
            if (!user.isActive) {
                res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated. Please contact administrator.',
                    code: 'ACCOUNT_INACTIVE',
                });
                return;
            }
            if (!allowedRoles.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied. Insufficient permissions.',
                });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Authorization check failed',
            });
        }
    };
};
exports.requireRole = requireRole;
exports.requireEmployee = (0, exports.requireRole)(constants_1.ROLES.EMPLOYEE, constants_1.ROLES.AGENT, constants_1.ROLES.ADMIN);
exports.requireAgent = (0, exports.requireRole)(constants_1.ROLES.AGENT, constants_1.ROLES.ADMIN);
exports.requireAdmin = (0, exports.requireRole)(constants_1.ROLES.ADMIN);
//# sourceMappingURL=role.middleware.js.map