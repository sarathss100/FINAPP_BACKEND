"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebtPaymentsSchema = exports.DebtSchema = void 0;
const mongoose_1 = require("mongoose");
exports.DebtSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    accountId: { type: String, default: null },
    debtName: { type: String, trim: true, maxlength: 100, required: true },
    initialAmount: { type: Number, min: 0, required: true },
    currency: { type: String, default: 'INR' },
    interestRate: { type: Number, default: 0 },
    interestType: { type: String, enum: ['Flat', 'Diminishing'], default: 'Diminishing' },
    tenureMonths: { type: Number, required: true },
    monthlyPayment: { type: Number, min: 0, requird: true },
    monthlyPrincipalPayment: { type: Number, min: 0, required: true },
    montlyInterestPayment: { type: Number, min: 0, required: true },
    startDate: { type: Date, default: Date.now },
    nextDueDate: {
        type: Date, default: () => {
            const now = new Date();
            return new Date(now.setMonth(now.getMonth() + 1));
        }
    },
    endDate: { type: Date },
    status: { type: String, enum: ['Active', 'Paid', 'Cancelled', 'Overdue'], default: 'Active' },
    currentBalance: { type: Number, min: 0, required: true },
    totalInterestPaid: { type: Number, default: 0 },
    totalPrincipalPaid: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    notes: { type: String, default: '', maxLength: 500 },
    isDeleted: { type: Boolean, default: false },
    isGoodDebt: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
}, { timestamps: true });
exports.DebtPaymentsSchema = new mongoose_1.Schema({
    debtId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Debt', required: true },
    amountPaid: { type: Number, required: true },
    principalAmount: { type: Number, required: true },
    interestAmount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    isLate: { type: Boolean, default: false }
}, { timestamps: true });
