import { Schema } from 'mongoose';

export const EPFOSchema = new Schema({
  account_number: String,
  epf_number: String,
  employer_contribution: Number,
  employee_contribution: Number,
  interest_rate: Number,
  maturity_amount: Number,
});
