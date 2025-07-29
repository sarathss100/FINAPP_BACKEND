import mongoose, { Model } from 'mongoose';
import { DebtPaymentsSchema, DebtSchema, } from '../schema/DebtSchema';
import { IDebtDocument, IDebtPaymentsDocument } from '../interfaces/IDebt';

DebtSchema.index({ userId: 1 });
DebtSchema.index({ status: 1 });
DebtSchema.index({ nextDueDate: 1 });

DebtPaymentsSchema.index({ debtId: 1 });

export const DebtModel: Model<IDebtDocument> = mongoose.model<IDebtDocument>('Debt', DebtSchema);
export const DebtPaymentModel: Model<IDebtPaymentsDocument> = mongoose.model<IDebtPaymentsDocument>('DebtPayments', DebtPaymentsSchema);
