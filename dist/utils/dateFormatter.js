"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const formatDuration = function (startDate = new Date(), endDate) {
    // Calculate years 
    const years = (0, date_fns_1.differenceInYears)(endDate, startDate);
    // Subtract years from the start date and calculate months 
    const adjustedStartDateForMonths = new Date(startDate);
    adjustedStartDateForMonths.setFullYear(startDate.getFullYear() + years);
    const months = (0, date_fns_1.differenceInMonths)(endDate, adjustedStartDateForMonths);
    // Subtract years and months from the start date and calculate days
    const adjustedStartDateForDays = new Date(adjustedStartDateForMonths);
    adjustedStartDateForDays.setMonth(startDate.getMonth() + months);
    const days = (0, date_fns_1.differenceInDays)(endDate, adjustedStartDateForDays);
    // Format the duration string
    return `${years ? years : 0} Y, ${months ? months : 0} M, ${days ? days : 0} D`;
};
exports.default = formatDuration;
