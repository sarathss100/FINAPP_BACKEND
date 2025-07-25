import { InvestmentDTO } from '../../../dtos/investments/investmentDTO';
import getMutualFundDetails from '../../../utils/mutualfunds/getMutualFundDetails';

/**
 * Updates current NAV and value for an array of mutual fund investments.
 *
 * @param investments - Array of MUTUAL_FUND type investments
 * @returns Promise<InvestmentDTO[]> - Updated investments with new NAV and values
 */
export const updateMutualFundPrices = async (
    investments: InvestmentDTO[]
): Promise<InvestmentDTO[]> => {
    const updatedInvestments: InvestmentDTO[] = [];

    for (const investment of investments) {
        if (!investment.schemeCode || typeof investment.schemeCode !== 'string') {
            console.warn(`Skipping ${investment._id}: Missing or invalid scheme code`);
            continue;
        }

        try {
            const mfDetails = await getMutualFundDetails(investment.schemeCode as string);
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
            } else {
                console.warn(`Skipping ${investment._id}: 'units' is not a number`);
                continue;
            }

            updatedInvestments.push(investment);
        } catch (error) {
            console.error(`Failed to update MF schemeCode ${investment.schemeCode}:`, (error as Error).message);
        }
    }

    return updatedInvestments;
};