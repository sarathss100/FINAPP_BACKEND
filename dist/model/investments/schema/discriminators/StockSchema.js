"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockSchema = void 0;
const mongoose_1 = require("mongoose");
exports.StockSchema = new mongoose_1.Schema({
    symbol: String,
    exchange: String,
    purchaseDate: Date,
    quantity: Number,
    purchasePricePerShare: Number,
    currentPricePerShare: Number,
    dividendsReceived: Number,
});
