"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MutualFundSchema = new mongoose_1.Schema({
    scheme_code: {
        type: String,
        required: true,
        unique: true,
    },
    scheme_name: {
        type: String,
        required: true,
    },
    net_asset_value: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    }
}, {
    timestamps: true,
});
exports.default = MutualFundSchema;
