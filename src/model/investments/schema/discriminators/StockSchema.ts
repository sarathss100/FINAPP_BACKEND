import { Schema } from 'mongoose';

export const StockSchema = new Schema({
  symbol: String,
  exchange: String,
  purchaseDate: Date,
  quantity: Number,
  purchasePricePerShare: Number,
  currentPricePerShare: Number,
  dividendsReceived: Number,
});
