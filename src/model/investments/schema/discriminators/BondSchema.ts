import { Schema } from 'mongoose';

export const BondSchema = new Schema({
  issuer: String,
  bondType: String,
  faceValue: Number,
  couponRate: Number,
  maturityDate: Date,
  purchaseDate: Date,
  currentValue: Number,
});
