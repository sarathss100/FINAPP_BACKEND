import mongoose, { Model } from 'mongoose';
import { IInsurance } from '../interfaces/IInsurance';
import InsuranceSchema from '../schema/InsuranceSchema';

export const InsuranceModel: Model<IInsurance> = mongoose.model<IInsurance>('Insurances', InsuranceSchema);
