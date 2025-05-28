import { Schema } from 'mongoose';

export const FixedDepositSchema = new Schema({
  bank: String,
  account_number: String,
  deposit_number: String,
  maturity_date: Date,
  interest_rate: Number,
  maturity_amount: Number,
});
