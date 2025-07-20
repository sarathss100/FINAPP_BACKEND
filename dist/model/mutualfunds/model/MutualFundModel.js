"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutualFundModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MutualFundSchema_1 = __importDefault(require("../schema/MutualFundSchema"));
// Compound index
MutualFundSchema_1.default.index({ scheme_code: 1, scheme_name: 1 }, { name: 'schemeCodeAndNameIndex' });
exports.MutualFundModel = mongoose_1.default.model('Mutual Funds', MutualFundSchema_1.default);
