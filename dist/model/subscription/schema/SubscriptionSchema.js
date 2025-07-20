"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    plan_name: { type: String, requird: true },
    plan_type: { type: String, enum: ['monthly', 'yearly'], required: true },
    payment_date: { type: Date, required: true },
    expiry_date: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['INR'], default: 'INR' },
    subscription_mode: { type: String, enum: ['auto_renewal', 'manual'], required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], required: true },
    payment_method: { type: String, required: true },
    transaction_id: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = SubscriptionSchema;
