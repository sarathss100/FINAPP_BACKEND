"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNextDueDate = exports.calculateLoanClosingMonth = void 0;
const calculateLoanClosingMonth = function (date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};
exports.calculateLoanClosingMonth = calculateLoanClosingMonth;
const calculateNextDueDate = function (date) {
    const result = new Date(date);
    // Get the currentYear/month/day
    const currentYear = result.getFullYear();
    const currentMonth = result.getMonth();
    const currentDay = result.getDate();
    // Move to next month 
    const nextMonth = currentMonth + 1;
    // Set to the same day in the next month
    result.setFullYear(currentYear, nextMonth, currentDay);
    // If day rolled over, set to last day of next month 
    if (result.getMonth() !== nextMonth % 12) {
        result.setFullYear(currentYear, nextMonth, 0); // Last day of previous month
    }
    return result;
};
exports.calculateNextDueDate = calculateNextDueDate;
