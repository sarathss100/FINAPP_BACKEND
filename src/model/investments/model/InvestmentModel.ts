import mongoose, { Model } from 'mongoose';
import { IInvestmentDocument } from '../interfaces/IInvestment';
import InvestmentSchema from '../schema/InvestmentSchema';

export const InvestmentModel: Model<IInvestmentDocument> = mongoose.model<IInvestmentDocument>('Investments', InvestmentSchema);
