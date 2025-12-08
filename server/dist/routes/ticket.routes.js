"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = require("../controllers/ticket.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
router.get('/categories', role_middleware_1.requireEmployee, admin_controller_1.adminController.getCategories);
router.post('/', role_middleware_1.requireEmployee, ticket_controller_1.ticketController.createTicket);
router.get('/', role_middleware_1.requireEmployee, ticket_controller_1.ticketController.getTickets);
router.get('/stats', role_middleware_1.requireAgent, ticket_controller_1.ticketController.getStats);
router.get('/:id', role_middleware_1.requireEmployee, ticket_controller_1.ticketController.getTicketById);
router.patch('/:id', role_middleware_1.requireAgent, ticket_controller_1.ticketController.updateTicket);
router.post('/:id/comments', role_middleware_1.requireEmployee, ticket_controller_1.ticketController.addComment);
router.patch('/:id/assign', role_middleware_1.requireAgent, ticket_controller_1.ticketController.assignTicket);
router.patch('/:id/resolve', role_middleware_1.requireEmployee, ticket_controller_1.ticketController.markAsResolved);
exports.default = router;
//# sourceMappingURL=ticket.routes.js.map