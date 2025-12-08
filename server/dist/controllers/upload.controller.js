"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = void 0;
const response_util_1 = require("../utils/response.util");
const uploadSingle = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json((0, response_util_1.errorResponse)('No file uploaded'));
            return;
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json((0, response_util_1.successResponse)('File uploaded successfully', {
            url: fileUrl,
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
        }));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to upload file'));
    }
};
exports.uploadSingle = uploadSingle;
const uploadMultiple = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json((0, response_util_1.errorResponse)('No files uploaded'));
            return;
        }
        const files = req.files.map((file) => ({
            url: `/uploads/${file.filename}`,
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        }));
        res.status(200).json((0, response_util_1.successResponse)('Files uploaded successfully', files));
    }
    catch (error) {
        res.status(500).json((0, response_util_1.errorResponse)('Failed to upload files'));
    }
};
exports.uploadMultiple = uploadMultiple;
//# sourceMappingURL=upload.controller.js.map