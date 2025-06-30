"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AccountsSchema_1 = require("../schema/AccountsSchema");
exports.AccountModel = mongoose_1.default.model('Accounts', AccountsSchema_1.AccountSchema);
