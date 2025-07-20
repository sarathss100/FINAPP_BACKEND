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
Object.defineProperty(exports, "__esModule", { value: true });
const calculateLoanBreakdown = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ initialAmount, tenureMonths, interestRate, interestType, targetMonth }) {
        try {
            let emi = 0;
            let interest = 0;
            let principal = 0;
            if (interestType === 'Flat') {
                // Flat Interest Calculation
                const totalInterest = initialAmount * (interestRate / 100) * (tenureMonths / 12);
                emi = (initialAmount + totalInterest) / tenureMonths;
                interest = totalInterest / tenureMonths;
                principal = emi - interest;
            }
            else if (interestType === 'Diminishing') {
                if (targetMonth < 1 || targetMonth > tenureMonths) {
                    throw new Error(`Target month must be between 1 and ${tenureMonths}`);
                }
                // Diminishing Balance Calculation (EMI formula)
                const monthlyRate = (interestRate / 100) / 12;
                let balance = initialAmount;
                const emi = (initialAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
                let currentMonth = 1;
                while (currentMonth <= targetMonth) {
                    const interest = balance * monthlyRate;
                    const principal = emi - interest;
                    balance -= principal;
                    currentMonth++;
                    if (currentMonth > targetMonth) {
                        return {
                            emi: Number(emi.toFixed(2)),
                            principal: Number(principal.toFixed(2)),
                            interest: Number(interest.toFixed(2))
                        };
                    }
                }
                throw new Error(`Could not calculate breakdown`);
            }
            else {
                throw new Error("Invalid interest type. Use 'Flat' or 'Diminishing'");
            }
            return {
                emi: Number(emi.toFixed(2)),
                principal: Number(principal.toFixed(2)),
                interest: Number(interest.toFixed(2)),
            };
        }
        catch (error) {
            throw new Error(error.message || `Something went wrong while calculating Emi`);
        }
    });
};
exports.default = calculateLoanBreakdown;
