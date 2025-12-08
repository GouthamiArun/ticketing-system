"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (message, data, pagination) => {
    const response = {
        success: true,
        message,
        data,
    };
    if (pagination) {
        response.page = pagination.page;
        response.limit = pagination.limit;
        response.total = pagination.total;
        response.totalPages = pagination.totalPages;
    }
    return response;
};
exports.successResponse = successResponse;
const errorResponse = (message, error) => {
    return {
        success: false,
        message,
        error,
    };
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=response.util.js.map