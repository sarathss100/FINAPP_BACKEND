"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InsuranceSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    coverage: { type: Number, required: true },
    premium: { type: Number, required: true },
    next_payment_date: { type: Date, required: true },
    payment_status: { type: String, required: true },
    status: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = InsuranceSchema;
