"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../config/logger/logger"));
class LoggerService {
    info(message) {
        logger_1.default.info(message);
    }
    error(message, error) {
        if (error) {
            logger_1.default.error(`${message} - ${error.message}`);
        }
        else {
            logger_1.default.error(message);
        }
    }
    warn(message) {
        logger_1.default.warn(message);
    }
    debug(message) {
        logger_1.default.debug(message);
    }
}
exports.default = new LoggerService();
