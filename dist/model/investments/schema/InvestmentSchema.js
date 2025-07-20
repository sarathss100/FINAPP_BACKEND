"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InvestmentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    relatedAccount: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Account' },
    currency: String,
    notes: String,
}, {
    timestamps: true,
    discriminatorKey: 'type',
});
exports.default = InvestmentSchema;
