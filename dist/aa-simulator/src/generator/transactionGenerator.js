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
exports.TransactionGenerator = void 0;
const AdminRepository_1 = __importDefault(require("repositories/admin/AdminRepository"));
const transactionTemplates_json_1 = __importDefault(require("aa-simulator/src/data/transaction/transactionTemplates.json"));
const transactionService_1 = require("../services/transactionService");
const AccountsManagementRepository_1 = __importDefault(require("repositories/accounts/AccountsManagementRepository"));
const adminRepository = AdminRepository_1.default.instance;
const accountsRepository = AccountsManagementRepository_1.default.instance;
class TransactionGenerator {
    static getRandomUser() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const users = yield adminRepository.findAllUsers();
            return (users !== null && users !== void 0 ? users : [])[Math.floor(Math.random() * ((_a = users === null || users === void 0 ? void 0 : users.length) !== null && _a !== void 0 ? _a : 0))];
        });
    }
    static getRandomAccount(useId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const accounts = yield accountsRepository.getUserAccounts(useId);
            return (accounts !== null && accounts !== void 0 ? accounts : [])[Math.floor(Math.random() * ((_a = accounts === null || accounts === void 0 ? void 0 : accounts.length) !== null && _a !== void 0 ? _a : 0))];
        });
    }
    static getRandomTemplate() {
        const templates = transactionTemplates_json_1.default.templates;
        return templates[Math.floor(Math.random() * templates.length)];
    }
    static generateRandomAmount(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    static generateTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Pick random user
                const randomUser = yield this.getRandomUser();
                // Pick random account
                const randomAccount = yield this.getRandomAccount(randomUser.userId);
                if (!(randomAccount === null || randomAccount === void 0 ? void 0 : randomAccount._id)) {
                    throw new Error('No valid account found for user');
                }
                // Pick random transaction template
                const template = this.getRandomTemplate();
                // Generate random amount within template range
                const amount = this.generateRandomAmount(template.amountRange[0], template.amountRange[1]);
                // Pick random description from template
                const description = this.getRandomFromArray(template.descriptions);
                const statusRandom = 'COMPLETED';
                // Build transaction payload
                const transactionData = {
                    user_id: randomUser.userId,
                    account_id: randomAccount._id,
                    transaction_type: template.transaction_type,
                    type: template.type,
                    category: template.category,
                    amount: amount,
                    currency: 'INR',
                    date: new Date(),
                    description: description,
                    tags: template.tags,
                    status: statusRandom,
                    transactionHash: '',
                    isDeleted: false,
                };
                // Submit transaction to main application
                yield transactionService_1.TransactionGeneratorService.submitTransaction(transactionData, randomUser);
            }
            catch (error) {
                console.error(`Transaction generation failed:`, error);
                throw error;
            }
        });
    }
}
exports.TransactionGenerator = TransactionGenerator;
;
