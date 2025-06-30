"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedDepositSchema = void 0;
const mongoose_1 = require("mongoose");
exports.FixedDepositSchema = new mongoose_1.Schema({
    maturityDate: Date,
    interestRate: String,
    maturityAmount: String,
});
