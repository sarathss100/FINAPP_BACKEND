import { Schema } from 'mongoose';

export const BusinessSchema = new Schema({
  businessName: String,
  ownershipPercentage: Number,
  investmentDate: Date,
  initialInvestment: Number,
  currentValuation: Number,
  annualReturn: Number,
});
