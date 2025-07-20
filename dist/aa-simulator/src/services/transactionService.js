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
exports.TransactionGeneratorService = void 0;
const tokenUtils_1 = require("utils/auth/tokenUtils");
const TransactionService_1 = __importDefault(require("services/transaction/TransactionService"));
const transactionService = TransactionService_1.default.instance;
class TransactionGeneratorService {
    // private static BASE_URL = process.env.BASE_URL;
    // private static TIMEOUT = 15000;
    static submitTransaction(transactionData, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refinedUserData = {
                    userId: user.userId,
                    phoneNumber: user.phoneNumber,
                    status: user.status,
                    role: user.role,
                    is2FA: user.is2FA || false,
                };
                const accessToken = yield (0, tokenUtils_1.generateAccessToken)(refinedUserData);
                transactionData.closing_balance = this.generateClosingBalance();
                yield transactionService.createTransaction(accessToken, transactionData);
                // Submit to main application
                // const response = await axios.post(
                //     `${this.BASE_URL}/api/transactions`,
                //     transactionData,
                //     {
                //         headers: {
                //             'Authorization': `Bearer ${accessToken}`,
                //             'Content-Type': 'application/json',
                //             'X-Source': 'account-aggregator-simulator',
                //             'X-User-Agent': 'AA-Simulator/1.0'
                //         },
                //         timeout: this.TIMEOUT
                //     }
                // );
                console.log(`Transaction submitted successfully`);
            }
            catch (error) {
                console.error(`Failed to submit transaction`);
                throw error;
            }
        });
    }
    static generateClosingBalance() {
        const min = 5000;
        const max = 200000;
        return Math.floor(Math.random() * (max - min) + min);
    }
}
exports.TransactionGeneratorService = TransactionGeneratorService;
;
