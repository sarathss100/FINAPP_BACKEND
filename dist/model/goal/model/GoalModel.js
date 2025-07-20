"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GoalSchema_1 = __importDefault(require("../schema/GoalSchema"));
exports.GoalModel = mongoose_1.default.model('Goals', GoalSchema_1.default);
