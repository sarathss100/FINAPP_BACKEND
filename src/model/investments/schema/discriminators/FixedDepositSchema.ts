import { Schema } from 'mongoose';

export const FixedDepositSchema = new Schema({
  maturityDate: Date,
  interestRate: String,
  maturityAmount: String,
});
