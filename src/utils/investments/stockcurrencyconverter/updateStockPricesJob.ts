// src/utils/updateStockPrices.ts

import axios from 'axios';
import { InvestmentDTO } from '../../../dtos/investments/investmentDTO';
import { detectCurrencyFromExchange } from './regionRegex';
import { getExchangeRate } from './currencyConverter';

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BATCH_SIZE = 5; // Max 5 API calls per minute
const DELAY_MS = 60_000; // 60 seconds between batches

/**
 * Updates stock prices for an array of stock investments.
 *
 * @param stocks - Array of investment DTOs with type STOCK
 * @returns Promise<InvestmentDTO[]> - Updated investment DTOs with new prices
 */
export const updateStockPrices = async (stocks: InvestmentDTO[]): Promise<InvestmentDTO[]> => {
    try {
        const symbols = [...new Set(stocks.map(s => s.symbol).filter(Boolean))] as string[];
        console.log(`Found ${symbols.length} unique stock symbols`);

        const chunkedSymbols = chunkArray(symbols, 100);
        let batchCount = 0;

        const updatedStocks: InvestmentDTO[] = [];

        for (const symbolChunk of chunkedSymbols) {
            if (batchCount > 0 && batchCount % BATCH_SIZE === 0) {
                console.log(`Delaying for ${DELAY_MS / 1000}s due to rate limits...`);
                await delay(DELAY_MS);
            }

            const symbolsStr = symbolChunk.join(',');
            const url = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${symbolsStr}&apikey=${ALPHA_VANTAGE_API_KEY}`;
            console.log(`Fetching prices for: ${symbolsStr}`);

            const res = await axios.get(url);
            const quotes = res.data['batchStockQuotes'] || [];

            for (const quote of quotes) {
                const meta = quote['quoteMode'] || {};
                const symbol = meta['symbol'];
                const price = Number(meta['ask']) || Number(meta['regularMarketPrice']) || 0;

                if (!symbol || !price) continue;

                const exchange = symbol.split('.')[1] || 'NASDAQ';
                const currency = detectCurrencyFromExchange(exchange);
                const inrPrice = await getExchangeRate(currency, 'INR', price);

                const stockDoc = stocks.find(s => s.symbol === symbol);
                if (!stockDoc) continue;

                stockDoc.currentPricePerShare = inrPrice;
                stockDoc.currentValue = inrPrice * (stockDoc.quantity as number);
                stockDoc.totalProfitOrLoss = inrPrice * (stockDoc.quantity as number) - (stockDoc.purchasePricePerShare as number) * (stockDoc.quantity as number);

                updatedStocks.push(stockDoc); // Push to updated list
            }

            batchCount++;
        }

        console.log(`Successfully updated prices for ${updatedStocks.length} stocks.`);
        return updatedStocks;

    } catch (error) {
        console.error('Failed to update stock prices:', (error as Error).message);
        return [];
    }
};

// Helper functions
function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}