import { Schema } from 'mongoose';

export const EPFOSchema = new Schema({
  accountNumber: String,
  epfNumber: String,
  employerContribution: Number,
  employeeContribution: Number,
  interestRate: Number,
  maturityAmount: Number,
});
