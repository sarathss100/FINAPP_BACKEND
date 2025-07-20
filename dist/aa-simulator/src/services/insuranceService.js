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
exports.InsuranceGeneratorService = void 0;
const tokenUtils_1 = require("utils/auth/tokenUtils");
const InsuranceService_1 = __importDefault(require("services/insurances/InsuranceService"));
const insuranceService = InsuranceService_1.default.instance;
class InsuranceGeneratorService {
    static submitInsurance(insuranceData, user) {
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
                yield insuranceService.createInsurance(accessToken, insuranceData);
                console.log(`Insurance submitted successfully`);
            }
            catch (error) {
                console.error(`Failed to submit Insurance`);
                throw error;
            }
        });
    }
}
exports.InsuranceGeneratorService = InsuranceGeneratorService;
