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
exports.startDebtGenerator = exports.generateSingleDebt = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const debtGenerator_1 = require("../generator/debtGenerator");
const generateSingleDebt = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Generate random debt...`);
        try {
            yield debtGenerator_1.DebtGenerator.generateDebt();
        }
        catch (error) {
            console.error(`Single debt generation failed`, error.message);
        }
    });
};
exports.generateSingleDebt = generateSingleDebt;
const startDebtGenerator = function () {
    console.log(`Debt Generator Application Start`);
    setTimeout(exports.generateSingleDebt, 2000);
    // Schedule cron job for every 10 minutes: */10 * * * * 
    node_cron_1.default.schedule('*/10 * * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log(`\nCron Job Triggered - ${new Date().toLocaleString()}`);
        yield (0, exports.generateSingleDebt)();
    }));
    console.log(`Cron job scheduled: Every 10 minutes`);
};
exports.startDebtGenerator = startDebtGenerator;
