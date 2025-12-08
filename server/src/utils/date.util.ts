import moment from 'moment-timezone';

// Set default timezone to IST
const TIMEZONE = 'Asia/Kolkata';
const DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';

/**
 * Get current date/time in IST format
 * @returns Formatted date string in IST (DD-MM-YYYY HH:mm:ss)
 */
export const getCurrentIST = (): string => {
  return moment().tz(TIMEZONE).format(DATE_FORMAT);
};

/**
 * Format a date to IST format
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in IST (DD-MM-YYYY HH:mm:ss)
 */
export const formatToIST = (date: Date | string | number): string => {
  return moment(date).tz(TIMEZONE).format(DATE_FORMAT);
};

/**
 * Get timestamp for database storage (still stores as Date object)
 * But will be formatted when retrieved
 * @returns Current Date object
 */
export const getTimestamp = (): Date => {
  return new Date();
};

/**
 * Format date for display in frontend
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in IST
 */
export const formatDisplayDate = (date: Date | string | number): string => {
  if (!date) return '';
  return formatToIST(date);
};
