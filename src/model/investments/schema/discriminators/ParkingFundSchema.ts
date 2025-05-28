import { Schema } from 'mongoose';

export const ParkingFundSchema = new Schema({
  fundType: String,
  linkedAccountId: { type: Schema.Types.ObjectId, ref: 'Account' },
});
