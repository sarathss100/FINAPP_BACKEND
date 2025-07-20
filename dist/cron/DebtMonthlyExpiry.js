"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const moment_1 = __importDefault(require("moment"));
const DebtService_1 = __importDefault(require("services/debt/DebtService"));
const debtService = DebtService_1.default.instance;
/**
 * Cron job that runs daily at midnight (UTC) to check and update expired debts.
 *
 * Any debt with a nextDueDate earlier than the current date will be marked as expired.
 */
const markExpiryDebts = new cron_1.CronJob('0 0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[CRON] Running daily debt expiry check at ${(0, moment_1.default)().format()}`);
    try {
        yield debtService.updateExpiry();
        console.log(`[CRON] Debt expiry check completed successfully.`);
    }
    catch (error) {
        console.error(`[CRON] Failed to complete debt expiry check`, error);
    }
}));
exports.default = markExpiryDebts;
