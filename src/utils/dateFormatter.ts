import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

const formatDuration = function (startDate: Date = new Date(), endDate: Date): string {
    // Calculate years 
    const years = differenceInYears(endDate, startDate);

    // Subtract years from the start date and calculate months 
    const adjustedStartDateForMonths = new Date(startDate);
    adjustedStartDateForMonths.setFullYear(startDate.getFullYear() + years);
    const months = differenceInMonths(endDate, adjustedStartDateForMonths);

    // Subtract years and months from the start date and calculate days
    const adjustedStartDateForDays = new Date(adjustedStartDateForMonths);
    adjustedStartDateForDays.setMonth(startDate.getMonth() + months);
    const days = differenceInDays(endDate, adjustedStartDateForDays);

    // Format the duration string
    return `${years ? years : 0} Y, ${months ? months : 0} M, ${days ? days : 0} D`;
}

export default formatDuration;
