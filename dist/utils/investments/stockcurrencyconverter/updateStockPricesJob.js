"use strict";
// src/utils/updateStockPrices.ts
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
exports.updateStockPrices = void 0;
const axios_1 = __importDefault(require("axios"));
const regionRegex_1 = require("./regionRegex");
const currencyConverter_1 = require("./currencyConverter");
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BATCH_SIZE = 5; // Max 5 API calls per minute
const DELAY_MS = 60000; // 60 seconds between batches
/**
 * Updates stock prices for an array of stock investments.
 *
 * @param stocks - Array of investment DTOs with type STOCK
 * @returns Promise<InvestmentDTO[]> - Updated investment DTOs with new prices
 */
const updateStockPrices = (stocks) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const symbols = [...new Set(stocks.map(s => s.symbol).filter(Boolean))];
        console.log(`Found ${symbols.length} unique stock symbols`);
        const chunkedSymbols = chunkArray(symbols, 100);
        let batchCount = 0;
        const updatedStocks = [];
        for (const symbolChunk of chunkedSymbols) {
            if (batchCount > 0 && batchCount % BATCH_SIZE === 0) {
                console.log(`Delaying for ${DELAY_MS / 1000}s due to rate limits...`);
                yield delay(DELAY_MS);
            }
            const symbolsStr = symbolChunk.join(',');
            const url = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${symbolsStr}&apikey=${ALPHA_VANTAGE_API_KEY}`;
            console.log(`Fetching prices for: ${symbolsStr}`);
            const res = yield axios_1.default.get(url);
            const quotes = res.data['batchStockQuotes'] || [];
            for (const quote of quotes) {
                const meta = quote['quoteMode'] || {};
                const symbol = meta['symbol'];
                const price = Number(meta['ask']) || Number(meta['regularMarketPrice']) || 0;
                if (!symbol || !price)
                    continue;
                const exchange = symbol.split('.')[1] || 'NASDAQ';
                const currency = (0, regionRegex_1.detectCurrencyFromExchange)(exchange);
                const inrPrice = yield (0, currencyConverter_1.getExchangeRate)(currency, 'INR', price);
                const stockDoc = stocks.find(s => s.symbol === symbol);
                if (!stockDoc)
                    continue;
                stockDoc.currentPricePerShare = inrPrice;
                stockDoc.currentValue = inrPrice * stockDoc.quantity;
                stockDoc.totalProfitOrLoss = inrPrice * stockDoc.quantity - stockDoc.purchasePricePerShare * stockDoc.quantity;
                updatedStocks.push(stockDoc); // Push to updated list
            }
            batchCount++;
        }
        console.log(`Successfully updated prices for ${updatedStocks.length} stocks.`);
        return updatedStocks;
    }
    catch (error) {
        console.error('Failed to update stock prices:', error.message);
        return [];
    }
});
exports.updateStockPrices = updateStockPrices;
// Helper functions
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
