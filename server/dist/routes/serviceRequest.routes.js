"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceRequest_controller_1 = require("../controllers/serviceRequest.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
router.post('/', role_middleware_1.requireEmployee, serviceRequest_controller_1.serviceRequestController.createServiceRequest);
router.get('/', role_middleware_1.requireEmployee, serviceRequest_controller_1.serviceRequestController.getServiceRequests);
router.get('/stats', role_middleware_1.requireAgent, serviceRequest_controller_1.serviceRequestController.getStats);
router.get('/:id', role_middleware_1.requireEmployee, serviceRequest_controller_1.serviceRequestController.getServiceRequestById);
router.patch('/:id', role_middleware_1.requireAgent, serviceRequest_controller_1.serviceRequestController.updateServiceRequest);
router.post('/:id/approve', role_middleware_1.requireAgent, serviceRequest_controller_1.serviceRequestController.approveServiceRequest);
router.post('/:id/reject', role_middleware_1.requireAgent, serviceRequest_controller_1.serviceRequestController.rejectServiceRequest);
router.post('/:id/comments', role_middleware_1.requireEmployee, serviceRequest_controller_1.serviceRequestController.addComment);
router.patch('/:id/assign', role_middleware_1.requireAgent, serviceRequest_controller_1.serviceRequestController.assignServiceRequest);
exports.default = router;
//# sourceMappingURL=serviceRequest.routes.js.map