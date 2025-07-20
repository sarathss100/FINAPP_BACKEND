"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transactionModel_1 = __importDefault(require("../schema/transactionModel"));
exports.TransactionModel = mongoose_1.default.model('Transaction', transactionModel_1.default);
