"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// User management (admin only)
router.get('/users', role_middleware_1.requireAdmin, admin_controller_1.adminController.getUsers);
router.get('/users/agents', role_middleware_1.requireAdmin, admin_controller_1.adminController.getAgents);
router.post('/users', role_middleware_1.requireAdmin, admin_controller_1.adminController.createUser);
router.patch('/users/:id', role_middleware_1.requireAdmin, admin_controller_1.adminController.updateUser);
router.patch('/users/:id/deactivate', role_middleware_1.requireAdmin, admin_controller_1.adminController.deactivateUser);
router.patch('/users/:id/activate', role_middleware_1.requireAdmin, admin_controller_1.adminController.activateUser);
// Category management (admin only)
router.get('/categories', role_middleware_1.requireAgent, admin_controller_1.adminController.getCategories);
router.post('/categories', role_middleware_1.requireAdmin, admin_controller_1.adminController.createCategory);
router.patch('/categories/:id', role_middleware_1.requireAdmin, admin_controller_1.adminController.updateCategory);
router.delete('/categories/:id', role_middleware_1.requireAdmin, admin_controller_1.adminController.deleteCategory);
// Analytics (admin and agents)
router.get('/analytics', role_middleware_1.requireAgent, admin_controller_1.adminController.getAnalytics);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map