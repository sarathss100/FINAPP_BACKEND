"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NotificatonSchema_1 = __importDefault(require("../schema/NotificatonSchema"));
exports.NotificationModel = mongoose_1.default.model('Notifications', NotificatonSchema_1.default);
