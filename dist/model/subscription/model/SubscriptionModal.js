"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SubscriptionSchema_1 = __importDefault(require("../schema/SubscriptionSchema"));
exports.SubscriptionModel = mongoose_1.default.model('Subscription', SubscriptionSchema_1.default);
