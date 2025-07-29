
export default interface IDebtPaymentDTO {
    _id?: string;
    debtId: string;
    amountPaid: number;
    principalAmount: number;
    interestAmount: number;
    paymentDate?: Date;
    isLate?: boolean;
}