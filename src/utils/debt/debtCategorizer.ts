const goodDebtTypes = [
    'Mortgage Loan',
    'Education Loan',
    'Business Loan',
    'Student Loan',
    'Investment Loan',
    'Rental Property Loan',
    'Vehicle Loan (commercial use)',
    'Low-interest loan for appreciating assets',
];

const badDebtTypes = [
    'Credit Card Debt',
    'Personal Loan (for consumption)',
    'Payday Loan',
    'Entertainment Loan',
    'Medical Debt (non-essential)',
    'High-interest financing (appliances, furniture)',
    'Luxury Item Financing',
    'Gambling Debt',
    'Vehicle Loan (personal use)',
    'Home Maintenance Loan',
    'Medical Debt (emergency treatment)',
    'Lend From Others'
];

export const categorizeDebt = function (debtName: string): boolean {
    if (goodDebtTypes.includes(debtName)) return true;
    if (badDebtTypes.includes(debtName)) return false;
    return false;
}
