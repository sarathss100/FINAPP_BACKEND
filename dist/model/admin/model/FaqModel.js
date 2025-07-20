"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const faqModel_1 = __importDefault(require("../schema/faqModel"));
exports.FaqModel = mongoose_1.default.model('Faq', faqModel_1.default);
