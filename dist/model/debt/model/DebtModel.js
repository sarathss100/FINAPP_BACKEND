"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebtPaymentModel = exports.DebtModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DebtSchema_1 = require("../schema/DebtSchema");
// Indexes 
DebtSchema_1.DebtSchema.index({ userId: 1 });
DebtSchema_1.DebtSchema.index({ status: 1 });
DebtSchema_1.DebtSchema.index({ nextDueDate: 1 });
DebtSchema_1.DebtPaymentsSchema.index({ debtId: 1 });
exports.DebtModel = mongoose_1.default.model('Debt', DebtSchema_1.DebtSchema);
exports.DebtPaymentModel = mongoose_1.default.model('DebtPayments', DebtSchema_1.DebtPaymentsSchema);
