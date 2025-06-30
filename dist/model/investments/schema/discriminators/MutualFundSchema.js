"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutualFundSchema = void 0;
const mongoose_1 = require("mongoose");
exports.MutualFundSchema = new mongoose_1.Schema({
    fundHouse: String,
    folioNumber: String,
    schemeCode: String,
    units: Number,
    purchasedNav: Number,
    currentNav: Number,
    currentValue: Number,
});
