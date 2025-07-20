"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    role: { type: String, enum: ['user', 'bot', 'admin'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
exports.default = ChatSchema;
