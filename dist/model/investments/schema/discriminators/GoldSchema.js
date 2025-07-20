"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoldSchema = void 0;
const mongoose_1 = require("mongoose");
exports.GoldSchema = new mongoose_1.Schema({
    goldForm: String,
    goldType: String,
    weight: Number,
    purchaseDate: Date,
    purchasePricePerGram: Number,
    currentPricePerGram: Number,
});
