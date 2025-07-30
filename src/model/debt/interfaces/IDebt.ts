import { Document, Types } from 'mongoose';

export interface IDebtDocument extends Document {
    _id: Types.ObjectId;
    userId: string;
    accountId: string | null;
    debtName: string;
    initialAmount: number;
    currency: string;
    interestRate: number;
    interestType: 'Flat' | 'Diminishing',
    tenureMonths: number;
    monthlyPayment: number;
    monthlyPrincipalPayment: number;
    montlyInterestPayment: number;
    startDate: Date;
    nextDueDate: Date;
    endDate: Date;
    status: 'Active' | 'Paid' | 'Cancelled' | 'Overdue';
    currentBalance: number;
    totalInterestPaid: number;
    totalPrincipalPaid: number;
    additionalCharges: number;
    notes: string;
    isDeleted: boolean;
    isGoodDebt: boolean;
    isCompleted: boolean;
    isExpired: boolean;
    __v?: number;
}

export interface IDebtPaymentsDocument extends Document {
    _id: Types.ObjectId;
    debtId: Types.ObjectId;
    amountPaid: number;
    principalAmount: number;
    interestAmount: number;
    paymentDate: Date;
    isLate: boolean;
    __v?: number;
}


