import mongoose, { Model } from 'mongoose';
import TransactionSchema from '../schema/transactionModel';
import ITransactionDocument from '../interfaces/ITransaction';

export const TransactionModel: Model<ITransactionDocument> = mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);
