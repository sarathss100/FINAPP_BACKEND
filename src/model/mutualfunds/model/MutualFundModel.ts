import mongoose, { Model } from 'mongoose';
import MutualFundSchema from '../schema/MutualFundSchema';
import { IMutualFund } from '../interfaces/IMutualFund';

// Compound index
MutualFundSchema.index({ scheme_code: 1, scheme_name: 1 }, { name: 'schemeCodeAndNameIndex' });

export const MutualFundModel: Model<IMutualFund> = mongoose.model<IMutualFund>('Mutual Funds', MutualFundSchema);
