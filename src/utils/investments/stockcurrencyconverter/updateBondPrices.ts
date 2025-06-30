import { InvestmentDTO } from 'dtos/investments/investmentDTO';
import calculateBondProfitOrLoss from './calculateBondProfitOrLoss';

/**
 * Updates current value and profit/loss for an array of BOND-type investments.
 *
 * @param investments - Array of BOND-type investments
 * @returns Promise<InvestmentDTO[]> - Updated investments with recalculated values
 */
export const updateBondPrices = async (
    investments: InvestmentDTO[]
): Promise<InvestmentDTO[]> => {
    return investments.map(inv => {
        if (
            inv.type === "BOND" &&
            "issuer" in inv &&
            "bondType" in inv &&
            "faceValue" in inv &&
            "couponRate" in inv &&
            "maturityDate" in inv
        ) {
            const { currentValue, totalProfitOrLoss } = calculateBondProfitOrLoss(inv);
            inv.currentValue = currentValue;
            inv.totalProfitOrLoss = totalProfitOrLoss;
        }
        return inv;
    });
};

