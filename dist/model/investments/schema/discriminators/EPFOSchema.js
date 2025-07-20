"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPFOSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EPFOSchema = new mongoose_1.Schema({
    accountNumber: String,
    epfNumber: String,
    employerContribution: Number,
    employeeContribution: Number,
    interestRate: Number,
    maturityAmount: Number,
});
