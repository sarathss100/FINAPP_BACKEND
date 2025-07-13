import { CronJob } from "cron";
import moment from "moment";
import IInvestmentService from "services/investments/interfaces/IInvestmentService";
import InvestmentService from "services/investments/InvestmentService";

const investmentService: IInvestmentService = InvestmentService.instance;

/**
 * Cron job that runs hourly to update stock prices for all STOCK-type investments.
 * 
 * Fetches live price data from external APIs and updates investment values in bulk.
 */
const updateMutualFundPrice = new CronJob(
    '0 0 0 * * *', 
    async () => {
        console.log(`[CRON] Running daily stock price update at ${moment().format()}`);
        try {
            await investmentService.updateMutualFundPrice();
            console.log(`[CRON] Stock price update completed successfully.`);
        } catch (error) {
            console.error(`[CRON] Failed to update stock prices`, error);
        }
    },
    null, // onComplete callback 
    true, // Start the job immediately when instantiated
    'UTC' // Timezone
);

export default updateMutualFundPrice;