import { Schema } from 'mongoose';

export const PropertySchema = new Schema({
  address: String,
  propertyType: String,
  purchaseDate: Date,
  purchasePrice: Number,
  currentValue: Number,
  rentalIncome: Number,
});
