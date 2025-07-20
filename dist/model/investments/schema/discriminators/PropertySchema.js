"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertySchema = void 0;
const mongoose_1 = require("mongoose");
exports.PropertySchema = new mongoose_1.Schema({
    address: String,
    propertyType: String,
    purchaseDate: Date,
    purchasePrice: Number,
    currentValue: Number,
    rentalIncome: Number,
});
