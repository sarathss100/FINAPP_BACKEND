"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema_1 = __importDefault(require("../schema/ChatSchema"));
// Indexes 
ChatSchema_1.default.index({ userId: 1 });
const ChatModel = mongoose_1.default.model('Chats', ChatSchema_1.default);
exports.default = ChatModel;
