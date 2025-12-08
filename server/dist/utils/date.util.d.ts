/**
 * Get current date/time in IST format
 * @returns Formatted date string in IST (DD-MM-YYYY HH:mm:ss)
 */
export declare const getCurrentIST: () => string;
/**
 * Format a date to IST format
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in IST (DD-MM-YYYY HH:mm:ss)
 */
export declare const formatToIST: (date: Date | string | number) => string;
/**
 * Get timestamp for database storage (still stores as Date object)
 * But will be formatted when retrieved
 * @returns Current Date object
 */
export declare const getTimestamp: () => Date;
/**
 * Format date for display in frontend
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in IST
 */
export declare const formatDisplayDate: (date: Date | string | number) => string;
//# sourceMappingURL=date.util.d.ts.map