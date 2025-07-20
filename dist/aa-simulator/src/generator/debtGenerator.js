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
exports.DebtGenerator = void 0;
const debtTemplates_json_1 = __importDefault(require("aa-simulator/src/data/debt/debtTemplates.json"));
const AccountsManagementRepository_1 = __importDefault(require("repositories/accounts/AccountsManagementRepository"));
const AdminRepository_1 = __importDefault(require("repositories/admin/AdminRepository"));
const debtService_1 = require("../services/debtService");
const adminRepository = AdminRepository_1.default.instance;
const accountsRepository = AccountsManagementRepository_1.default.instance;
class DebtGenerator {
    static getRandomUser() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const users = yield adminRepository.findAllUsers();
            return (users !== null && users !== void 0 ? users : [])[Math.floor(Math.random() * ((_a = users === null || users === void 0 ? void 0 : users.length) !== null && _a !== void 0 ? _a : 0))];
        });
    }
    static getRandomAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const accounts = yield accountsRepository.getUserAccounts(userId);
            return (accounts !== null && accounts !== void 0 ? accounts : [])[Math.floor(Math.random() * ((_a = accounts === null || accounts === void 0 ? void 0 : accounts.length) !== null && _a !== void 0 ? _a : 0))];
        });
    }
    static getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    static generateRandomAmount(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static calculateLoanDetails(initialAmount, interestRate, tenureMonths, interestType) {
        const monthlyInterestRate = interestRate / 100 / 12;
        let monthlyPayment = 0;
        let totalInterest = 0;
        if (interestType === 'Flat') {
            totalInterest = initialAmount * (interestRate / 100) * (tenureMonths / 12);
            monthlyPayment = (initialAmount + totalInterest) / tenureMonths;
        }
        else {
            monthlyPayment = (initialAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenureMonths));
            totalInterest = monthlyPayment * tenureMonths - initialAmount;
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + tenureMonths);
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        return {
            monthlyPayment: Math.round(monthlyPayment),
            totalInterest: Math.round(totalInterest),
            startDate,
            endDate,
            nextDueDate
        };
    }
    static generateDebt() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Pick random user
                const randomUser = yield this.getRandomUser();
                // Pick random account
                const randomAccount = yield this.getRandomAccount(randomUser.userId);
                // Pick random debt template
                const template = this.getRandomFromArray(debtTemplates_json_1.default.templates);
                // Generate loan details
                const debtName = this.getRandomFromArray(template.debtNameOptions);
                const initialAmount = this.generateRandomAmount(template.amountRange[0], template.amountRange[1]);
                const interestRate = parseFloat((Math.random() * (template.interestRateRange[1] - template.interestRateRange[0]) + template.interestRateRange[0]).toFixed(2));
                const tenureMonths = this.generateRandomAmount(template.tenureRange[0], template.tenureRange[1]);
                const interestType = this.getRandomFromArray(template.interestTypeOptions);
                const isGoodDebt = this.getRandomFromArray(template.isGoodDebtOptions);
                const notes = this.getRandomFromArray(template.notesOptions);
                const { monthlyPayment, totalInterest, startDate, endDate, nextDueDate } = this.calculateLoanDetails(initialAmount, interestRate, tenureMonths, interestType);
                const debtData = {
                    _id: '',
                    userId: randomUser.userId,
                    accountId: (randomAccount === null || randomAccount === void 0 ? void 0 : randomAccount._id) ? String(randomAccount._id) : null,
                    debtName,
                    initialAmount,
                    currency: template.currency,
                    interestRate,
                    interestType,
                    tenureMonths,
                    monthlyPayment,
                    monthlyPrincipalPayment: Math.round(monthlyPayment - (totalInterest / tenureMonths)),
                    montlyInterestPayment: Math.round(totalInterest / tenureMonths),
                    startDate,
                    nextDueDate,
                    endDate,
                    status: 'Active',
                    currentBalance: initialAmount,
                    totalInterestPaid: 0,
                    totalPrincipalPaid: 0,
                    additionalCharges: 0,
                    notes,
                    isDeleted: false,
                    isGoodDebt,
                    isCompleted: false,
                    isExpired: false
                };
                // Submit Debt to main application
                yield debtService_1.DebtGeneratorService.submitDebt(debtData, randomUser);
                console.log(`Debt created: ${debtName} for user ${randomUser.userId}`);
            }
            catch (error) {
                console.error(`Debt generation failed:`, error);
            }
        });
    }
}
exports.DebtGenerator = DebtGenerator;
