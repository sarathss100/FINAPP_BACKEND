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
exports.startTransactionGenerator = exports.generateSingleTransaction = void 0;
const transactionGenerator_1 = require("../generator/transactionGenerator");
const node_cron_1 = __importDefault(require("node-cron"));
const generateSingleTransaction = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Generate random transaction...`);
        try {
            yield transactionGenerator_1.TransactionGenerator.generateTransaction();
        }
        catch (error) {
            console.error(`Single transaction generation failed`, error.message);
        }
    });
};
exports.generateSingleTransaction = generateSingleTransaction;
const startTransactionGenerator = function () {
    console.log(`Transaction Generator Application Start`);
    // Generate initial transaction
    setTimeout(exports.generateSingleTransaction, 2000);
    // Schedule cron job for every 10 minutes: */10 * * * * 
    node_cron_1.default.schedule('*/10 * * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log(`\nCron Job Triggered - ${new Date().toLocaleString()}`);
        yield (0, exports.generateSingleTransaction)();
    }));
    console.log(`Cron job scheduled: Every 10 minutes`);
};
exports.startTransactionGenerator = startTransactionGenerator;
