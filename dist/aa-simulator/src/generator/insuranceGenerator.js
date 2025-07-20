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
exports.InsuranceGenerator = void 0;
const insuranceTemplates_json_1 = __importDefault(require("aa-simulator/src/data/insurance/insuranceTemplates.json"));
const AdminRepository_1 = __importDefault(require("repositories/admin/AdminRepository"));
const insuranceService_1 = require("../services/insuranceService");
const adminRepository = AdminRepository_1.default.instance;
class InsuranceGenerator {
    static getRandomUser() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const users = yield adminRepository.findAllUsers();
            return (users !== null && users !== void 0 ? users : [])[Math.floor(Math.random() * ((_a = users === null || users === void 0 ? void 0 : users.length) !== null && _a !== void 0 ? _a : 0))];
        });
    }
    static getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    static generateRandomAmount(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static generateInsurance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Pick random user
                const randomUser = yield this.getRandomUser();
                // Pick random insurance template
                const template = this.getRandomFromArray(insuranceTemplates_json_1.default.templates);
                // Generate insurance details
                const insuranceType = template.type;
                const coverage = this.generateRandomAmount(template.coverageRange[0], template.coverageRange[1]);
                const premium = this.generateRandomAmount(template.premiumRange[0], template.premiumRange[1]);
                const paymentStatus = this.getRandomFromArray(template.paymentStatusOptions);
                const status = this.getRandomFromArray(template.statusOptions);
                // Set next payment date (if payment is not 'Paid')
                const nextPaymentDate = new Date();
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                const insuranceData = {
                    userId: randomUser.userId,
                    type: insuranceType,
                    coverage,
                    premium,
                    next_payment_date: paymentStatus === 'Paid' ? new Date() : nextPaymentDate,
                    payment_status: paymentStatus,
                    status
                };
                // Submit Insurance to main application
                yield insuranceService_1.InsuranceGeneratorService.submitInsurance(insuranceData, randomUser);
                console.log(`Insurance created: ${insuranceType} for user ${randomUser.userId}`);
            }
            catch (error) {
                console.error(`Insurance generation failed:`, error);
            }
        });
    }
}
exports.InsuranceGenerator = InsuranceGenerator;
