import mongoose, { Model } from 'mongoose';
import IAccountDocument from '../interfaces/IAccounts';
import { AccountSchema } from '../schema/AccountsSchema';

export const AccountModel: Model<IAccountDocument> = mongoose.model<IAccountDocument>('Accounts', AccountSchema);

