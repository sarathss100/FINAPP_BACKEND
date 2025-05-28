import { Schema } from 'mongoose';

export const GoldSchema = new Schema({
  goldForm: String,
  goldType: String,
  weight: Number,
  purchaseDate: Date,
  purchasePricePerGram: Number,
  currentPricePerGram: Number,
});
