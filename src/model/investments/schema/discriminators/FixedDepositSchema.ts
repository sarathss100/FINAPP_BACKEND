import { Schema } from 'mongoose';

export const FixedDepositSchema = new Schema({
  maturity_date: Date,
  interest_rate: String,
  maturity_amount: String,
});
