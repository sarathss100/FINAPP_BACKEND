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
exports.updateMutualFundPrices = void 0;
const getMutualFundDetails_1 = __importDefault(require("utils/mutualfunds/getMutualFundDetails"));
/**
 * Updates current NAV and value for an array of mutual fund investments.
 *
 * @param investments - Array of MUTUAL_FUND type investments
 * @returns Promise<InvestmentDTO[]> - Updated investments with new NAV and values
 */
const updateMutualFundPrices = (investments) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedInvestments = [];
    for (const investment of investments) {
        if (!investment.schemeCode || typeof investment.schemeCode !== 'string') {
            console.warn(`Skipping ${investment._id}: Missing or invalid scheme code`);
            continue;
        }
        try {
            const mfDetails = yield (0, getMutualFundDetails_1.default)(investment.schemeCode);
            const currentNav = mfDetails.net_asset_value;
            // Skip if no valid NAV returned
            if (!currentNav) {
                console.warn(`No NAV found for schemeCode: ${investment.schemeCode}`);
                continue;
            }
            // Update fields
            investment.currentNav = currentNav;
            if (typeof investment.units === 'number') {
                investment.currentValue = investment.units * currentNav;
                investment.totalProfitOrLoss = investment.units * currentNav - investment.initialAmount;
            }
            else {
                console.warn(`Skipping ${investment._id}: 'units' is not a number`);
                continue;
            }
            updatedInvestments.push(investment);
        }
        catch (error) {
            console.error(`Failed to update MF schemeCode ${investment.schemeCode}:`, error.message);
        }
    }
    return updatedInvestments;
});
exports.updateMutualFundPrices = updateMutualFundPrices;
