"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_winston_1 = __importDefault(require("express-winston"));
const logger_1 = __importDefault(require("config/logger/logger"));
const loggingMiddleware = express_winston_1.default.logger({
    winstonInstance: logger_1.default,
    statusLevels: true,
    msg: `HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms`,
    meta: true,
    expressFormat: true,
    colorize: false
});
exports.default = loggingMiddleware;
