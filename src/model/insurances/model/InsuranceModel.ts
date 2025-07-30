import mongoose, { Model } from 'mongoose';
import IInsuranceDocument from '../interfaces/IInsurance';
import InsuranceSchema from '../schema/InsuranceSchema';

export const InsuranceModel: Model<IInsuranceDocument> = mongoose.model<IInsuranceDocument>('Insurances', InsuranceSchema);
