/**
 * DTO for Debt Payment entity
 */
export interface IDebtPaymentDTO {
    _id?: string;
    debtId: string; // Required field
    amountPaid: number; // Must be greater than zero
    principalAmount: number; // Must be >= 0
    interestAmount: number; // Must be >= 0
    paymentDate?: Date; // Default is current date
    isLate?: boolean; // Default false
}