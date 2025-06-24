import axios from 'axios';

export const getExchangeRate = async function (fromCurrency: string, toCurrency: string = 'INR', amount: number): Promise<number> {
    if (fromCurrency === toCurrency) return 1.0;

    try {
        const apiKey = process.env.EXCHANGE_RATE_API;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const res = await axios.get(url);
        console.log(res.data);
        return parseFloat(res.data.conversion_result);
    } catch (error) {
        console.error((error as Error).message || `Failed to fetch exchange rate for ${fromCurrency} → INR`);
        return 1.0;
    }
}
