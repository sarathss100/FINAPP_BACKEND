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
exports.updateBondPrices = void 0;
const calculateBondProfitOrLoss_1 = __importDefault(require("./calculateBondProfitOrLoss"));
/**
 * Updates current value and profit/loss for an array of BOND-type investments.
 *
 * @param investments - Array of BOND-type investments
 * @returns Promise<InvestmentDTO[]> - Updated investments with recalculated values
 */
const updateBondPrices = (investments) => __awaiter(void 0, void 0, void 0, function* () {
    return investments.map(inv => {
        if (inv.type === "BOND" &&
            "issuer" in inv &&
            "bondType" in inv &&
            "faceValue" in inv &&
            "couponRate" in inv &&
            "maturityDate" in inv) {
            const { currentValue, totalProfitOrLoss } = (0, calculateBondProfitOrLoss_1.default)(inv);
            inv.currentValue = currentValue;
            inv.totalProfitOrLoss = totalProfitOrLoss;
        }
        return inv;
    });
});
exports.updateBondPrices = updateBondPrices;
