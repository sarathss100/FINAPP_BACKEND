import { Schema } from 'mongoose';

const InvestmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'STOCK',
        'MUTUAL_FUND',
        'BOND',
        'PROPERTY',
        'BUSINESS',
        'FIXED_DEPOSIT',
        'EPFO',
        'GOLD',
        'PARKING_FUND',
      ],
    },
    name: String,
    icon: String,
    initialAmount: Number,
    currentValue: Number,
    totalProfitOrLoss: Number,
    relatedAccount: { type: Schema.Types.ObjectId, ref: 'Account' },
    currency: String,
    notes: String,
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
  }
);

export default InvestmentSchema;

