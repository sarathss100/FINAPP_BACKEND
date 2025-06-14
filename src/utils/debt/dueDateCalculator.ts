
export const calculateLoanClosingMonth = function (date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

export const calculateNextDueDate = function (date: Date): Date {
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
