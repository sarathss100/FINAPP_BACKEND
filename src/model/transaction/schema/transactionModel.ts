import { Schema } from 'mongoose';

const TransactionSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },
    tenant_id: { type: Schema.Types.ObjectId },
    account_id: { type: String, required: true },
    type: { type: String, enum: ['REGULAR', 'TRANSFER', 'PAYMENT', 'ADJUSTMENT', 'FEE', 'REFUND', 'DEPOSIT', 'WITHDRAWAL', 'INTEREST', 'DIVIDEND', 'REWARD', 'BONUS', 'CASHBACK', 'REDEMPTION', 'CONVERSION', 'EXCHANGE', 'LOAN', 'BORROWING', 'LENDING', 'INVESTMENT', 'PURCHASE', 'SALE', 'EXTRACTION'], required: true },
    category: { type: String, enum: ['FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'HEALTH', 'EDUCATION', 'SHOPPING', 'TRAVEL', 'BILLS', 'SUBSCRIPTIONS', 'GIFTS', 'SAVINGS', 'INVESTMENTS', 'MISCELLANEOUS'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: false },
    tags: [{ type: String }],
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
    related_account_id: { type: String },
    linked_entities: {
        type: [
            {
                entity_id: { type: Schema.Types.ObjectId, required: true },
                entity_type: {
                    type: String,
                    enum: ['GOAL', 'DEBT', 'INVESTMENT', 'INSURANCE', 'TAX_GROUP', 'LOAN', 'CREDIT_CARD', 'SAVINGS_ACCOUNT', 'CHECKING_ACCOUNT', 'MORTGAGE', 'OTHER'],
                    required: true
                },
                amount: { type: Number, required: true },
                currency: { type: String, required: true },
            },
        ],
        default: [],
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

export default TransactionSchema;
