import axios from 'axios';

export const getExchangeRate = async function (fromCurrency: string, toCurrency: string = 'INR', amount: number): Promise<number> {
    if (fromCurrency === toCurrency) return 1.0;

    try {
        const apiKey = process.env.EXCHANGE_RATE_API;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const res = await axios.get(url);
        return parseFloat(res.data.convertion_result);
    } catch (error) {
        console.error((error as Error).message || `Failed to fetch exchange rate for ${fromCurrency} → INR`);
        return 1.0;
    }
}

// export async function convertStockToInr(formData, apiKey: string): Promise<void> {
//   const exchange = formData.exchange || formData['4. region'] || '';
//   const purchasePriceLocal = formData.purchasePricePerShare || 0;
//   const quantity = formData.quantity || 1;

//   const fromCurrency = detectCurrencyFromExchange(exchange);
//   const exchangeRate = await getExchangeRate(fromCurrency, 'INR', apiKey);

//   return {
//     ...formData,
//     purchasePriceInr: purchasePriceLocal * exchangeRate,
//     totalInvestmentInr: purchasePriceLocal * exchangeRate * quantity,
//     localCurrency: fromCurrency
//   };
// }
