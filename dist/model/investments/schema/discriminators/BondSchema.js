"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BondSchema = new mongoose_1.Schema({
    issuer: String,
    bondType: String,
    faceValue: Number,
    couponRate: Number,
    maturityDate: Date,
    purchaseDate: Date,
    currentValue: Number,
});
