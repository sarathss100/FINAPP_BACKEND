"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const InsuranceSchema_1 = __importDefault(require("../schema/InsuranceSchema"));
exports.InsuranceModel = mongoose_1.default.model('Insurances', InsuranceSchema_1.default);
