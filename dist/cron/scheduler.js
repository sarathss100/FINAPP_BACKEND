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
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = __importDefault(require("config/logger/logger"));
const MutualFundService_1 = __importDefault(require("services/mutualfunds/MutualFundService"));
const checkSubscriptions_1 = require("./checkSubscriptions");
const mutualFundService = MutualFundService_1.default.instance;
// Schedule job to run daily at 2 AM
node_cron_1.default.schedule('0 2 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Starting daily NAV synchronization...');
    try {
        const isSynched = yield mutualFundService.syncNavData();
        if (isSynched) {
            logger_1.default.info(`NAV data synchronized successfully.`);
        }
        else {
            logger_1.default.warn(`NAV data synchornization completed but no changes were made.`);
        }
    }
    catch (error) {
        logger_1.default.error(`Error during NAV synchronization: ${error.message}`);
    }
}));
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Running scheduled task: checkAndExpireSubscriptions`);
    yield (0, checkSubscriptions_1.checkAndExpireSubscriptions)();
}));
