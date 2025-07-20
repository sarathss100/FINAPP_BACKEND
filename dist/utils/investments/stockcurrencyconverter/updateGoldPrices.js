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
exports.updateGoldPrices = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Updates current price per gram and value for an array of GOLD-type investments.
 *
 * @param investments - Array of GOLD-type investments
 * @returns Promise<InvestmentDTO[]> - Updated investments with new values
 */
const updateGoldPrices = (investments) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch current gold price (per gram)
        const res = yield axios_1.default.get(`https://api.gold-api.com/price/XAU`);
        const currentPricePerGram = res.data['price'] || 0;
        if (!currentPricePerGram) {
            throw new Error('Failed to fetch valid gold price');
        }
        // Update each investment
        const updatedInvestments = investments.map(inv => {
            const weight = typeof inv.weight === 'number' ? inv.weight : 0;
            const purchasePricePerGram = typeof inv.purchasePricePerGram === 'number' ? inv.purchasePricePerGram : 0;
            inv.currentPricePerGram = currentPricePerGram;
            inv.currentValue = currentPricePerGram * weight;
            inv.totalProfitOrLoss = (currentPricePerGram * weight) - (purchasePricePerGram * weight);
            return inv;
        });
        return updatedInvestments;
    }
    catch (error) {
        console.error('Error fetching gold price:', error.message);
        return [];
    }
});
exports.updateGoldPrices = updateGoldPrices;
