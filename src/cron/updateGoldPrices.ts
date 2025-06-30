import { CronJob } from 'cron';
import moment from 'moment';
import InvestmentService from 'services/investments/InvestmentService';


const investmentService = InvestmentService.instance;

/**
 * Cron job that runs daily to update gold prices for all GOLD-type investments.
 *
 * Fetches latest price per gram and updates investment values in bulk.
 */
const updateGoldPricesCron = new CronJob(
    '0 0 8 * * *', // Runs daily at 8 AM UTC
    async () => {
        console.log(`[CRON] Running gold price update at ${moment().format()}`);
        try {
            await investmentService.updateGoldPrice();
            console.log(`[CRON] Gold price update completed successfully.`);
        } catch (error) {
            console.error(`[CRON] Failed to update gold prices`, error);
        }
    },
    null,
    true,
    'UTC'
);

export default updateGoldPricesCron;