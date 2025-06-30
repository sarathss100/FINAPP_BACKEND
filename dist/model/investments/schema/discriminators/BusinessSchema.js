"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BusinessSchema = new mongoose_1.Schema({
    businessName: String,
    ownershipPercentage: Number,
    investmentDate: Date,
    initialInvestment: Number,
    currentValuation: Number,
    annualReturn: Number,
});
