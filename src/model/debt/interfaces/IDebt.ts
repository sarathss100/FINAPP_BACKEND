import { Document, Types } from 'mongoose';

export interface IDebt extends Document {
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
}

export interface IDebtPayments extends Document {
    _id: Types.ObjectId;
    debtId: Types.ObjectId;
    amountPaid: number;
    principalAmount: number;
    interestAmount: number;
    paymentDate: Date;
    isLate: boolean;
}


