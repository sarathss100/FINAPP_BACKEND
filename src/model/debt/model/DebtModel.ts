import mongoose, { Model } from 'mongoose';
import { DebtPaymentsSchema, DebtSchema, } from '../schema/DebtSchema';
import { IDebt, IDebtPayments } from '../interfaces/IDebt';

// Indexes 
DebtSchema.index({ userId: 1 });
DebtSchema.index({ status: 1 });
DebtSchema.index({ nextDueDate: 1 });

DebtPaymentsSchema.index({ debtId: 1 });

export const DebtModel: Model<IDebt> = mongoose.model<IDebt>('Debt', DebtSchema);
export const DebtPaymentModel: Model<IDebtPayments> = mongoose.model<IDebtPayments>('DebtPayments', DebtPaymentsSchema);
