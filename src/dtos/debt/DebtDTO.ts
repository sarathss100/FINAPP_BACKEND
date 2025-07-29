export default interface IDebtDTO {
    _id?: string;
    userId?: string; 
    accountId?: string | null;
    debtName: string;
    initialAmount: number;
    currency?: string;
    interestRate?: number;
    interestType?: 'Flat' | 'Diminishing';
    tenureMonths: number;
    monthlyPayment?: number;
    monthlyPrincipalPayment?: number;
    montlyInterestPayment?: number;
    startDate?: Date;
    nextDueDate?: Date;
    endDate?: Date;
    status?: 'Active' | 'Paid' | 'Cancelled' | 'Overdue';
    currentBalance?: number;
    totalInterestPaid?: number;
    totalPrincipalPaid?: number;
    additionalCharges?: number;
    notes?: string;
    isDeleted?: boolean;
    isGoodDebt?: boolean;
    isCompleted?: boolean;
    isExpired?: boolean;
}