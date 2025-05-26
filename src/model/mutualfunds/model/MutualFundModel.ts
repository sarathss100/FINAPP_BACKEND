import mongoose, { Model } from 'mongoose';
import MutualFundSchema from '../schema/MutualFundSchema';
import { IMutualFund } from 'model/investments/interfaces/IInvestment';

export const MutualFundModel: Model<IMutualFund> = mongoose.model<IMutualFund>('Mutual Funds', MutualFundSchema);
