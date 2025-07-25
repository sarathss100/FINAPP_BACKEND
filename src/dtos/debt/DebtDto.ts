export interface IDebtDTO {
    _id?: string;
    userId?: string; // Required if present
    accountId?: string | null;
    debtName: string; // Min 3, Max 100
    initialAmount: number; // Must be >= 0
    currency?: string; // Default 'INR'
    interestRate?: number; // Default 0
    interestType?: 'Flat' | 'Diminishing'; // Default 'Diminishing'
    tenureMonths: number; // Must be >= 1
    monthlyPayment?: number; // Must be >= 0
    monthlyPrincipalPayment?: number; // Default 0
    montlyInterestPayment?: number; // Default 0
    startDate?: Date; // Default new Date()
    nextDueDate?: Date; // Default next month
    endDate?: Date;
    status?: 'Active' | 'Paid' | 'Cancelled' | 'Overdue'; // Default 'Active'
    currentBalance?: number; // Must be >= 0
    totalInterestPaid?: number; // Default 0
    totalPrincipalPaid?: number; // Default 0
    additionalCharges?: number; // Default 0
    notes?: string; // Max 500 characters
    isDeleted?: boolean; // Default false
    isGoodDebt?: boolean; // Default false
    isCompleted?: boolean; // Default false
    isExpired?: boolean; // Default false
}