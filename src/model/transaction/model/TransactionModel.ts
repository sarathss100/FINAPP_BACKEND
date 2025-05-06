import mongoose, { Model } from 'mongoose';
import TransactionSchema from '../schema/transactionModel';
import ITransaction from '../interfaces/ITransaction';

export const TransactionModel: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);
