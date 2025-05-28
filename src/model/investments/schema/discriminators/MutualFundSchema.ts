import { Schema } from 'mongoose';

export const MutualFundSchema = new Schema({
  fundHouse: String,
  folioNumber: String,
  schemeCode: String,
  units: Number,
  purchasedNav: Number,
  currentNav: Number,
  currentValue: Number,
});
