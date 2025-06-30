import axios from 'axios';
import { InvestmentDTO } from 'dtos/investments/investmentDTO';

/**
 * Updates current price per gram and value for an array of GOLD-type investments.
 *
 * @param investments - Array of GOLD-type investments
 * @returns Promise<InvestmentDTO[]> - Updated investments with new values
 */
export const updateGoldPrices = async (investments: InvestmentDTO[]): Promise<InvestmentDTO[]> => {
    try {
        // Fetch current gold price (per gram)
        const res = await axios.get(`https://api.gold-api.com/price/XAU`);

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

    } catch (error) {
        console.error('Error fetching gold price:', (error as Error).message);
        return [];
    }
};