import mongoose, { Model } from 'mongoose';
import MutualFundSchema from '../schema/MutualFundSchema';
import IMutualFundDocument from '../interfaces/IMutualFund';

// Compound index
MutualFundSchema.index({ scheme_code: 1, scheme_name: 1 }, { name: 'schemeCodeAndNameIndex' });

export const MutualFundModel: Model<IMutualFundDocument> = mongoose.model<IMutualFundDocument>('Mutual Funds', MutualFundSchema);
