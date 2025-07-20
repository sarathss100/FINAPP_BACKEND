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
const InvestmentService_1 = __importDefault(require("services/investments/InvestmentService"));
const investmentService = InvestmentService_1.default.instance;
/**
 * Cron job that runs daily to update gold prices for all GOLD-type investments.
 *
 * Fetches latest price per gram and updates investment values in bulk.
 */
const updateGoldPricesCron = new cron_1.CronJob('0 0 8 * * *', // Runs daily at 8 AM UTC
() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[CRON] Running gold price update at ${(0, moment_1.default)().format()}`);
    try {
        yield investmentService.updateGoldPrice();
        console.log(`[CRON] Gold price update completed successfully.`);
    }
    catch (error) {
        console.error(`[CRON] Failed to update gold prices`, error);
    }
}), null, true, 'UTC');
exports.default = updateGoldPricesCron;
