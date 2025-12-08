"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDisplayDate = exports.getTimestamp = exports.formatToIST = exports.getCurrentIST = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Set default timezone to IST
const TIMEZONE = 'Asia/Kolkata';
const DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';
/**
 * Get current date/time in IST format
 * @returns Formatted date string in IST (DD-MM-YYYY HH:mm:ss)
 */
const getCurrentIST = () => {
    return (0, moment_timezone_1.default)().tz(TIMEZONE).format(DATE_FORMAT);
};
exports.getCurrentIST = getCurrentIST;
/**
 * Format a date to IST format
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in IST (DD-MM-YYYY HH:mm:ss)
 */
const formatToIST = (date) => {
    return (0, moment_timezone_1.default)(date).tz(TIMEZONE).format(DATE_FORMAT);
};
exports.formatToIST = formatToIST;
/**
 * Get timestamp for database storage (still stores as Date object)
 * But will be formatted when retrieved
 * @returns Current Date object
 */
const getTimestamp = () => {
    return new Date();
};
exports.getTimestamp = getTimestamp;
/**
 * Format date for display in frontend
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in IST
 */
const formatDisplayDate = (date) => {
    if (!date)
        return '';
    return (0, exports.formatToIST)(date);
};
exports.formatDisplayDate = formatDisplayDate;
//# sourceMappingURL=date.util.js.map