"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
router.post('/', role_middleware_1.requireEmployee, upload_middleware_1.upload.single('file'), upload_controller_1.uploadSingle);
router.post('/multiple', role_middleware_1.requireEmployee, upload_middleware_1.upload.array('files', 10), upload_controller_1.uploadMultiple);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map