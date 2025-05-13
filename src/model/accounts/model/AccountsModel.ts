import mongoose, { Model } from 'mongoose';
import { IAccount } from '../interfaces/IAccounts';
import { AccountSchema } from '../schema/AccountsSchema';

export const AccountModel: Model<IAccount> = mongoose.model<IAccount>('Accounts', AccountSchema);

