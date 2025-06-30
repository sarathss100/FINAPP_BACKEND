import { CronJob } from 'cron';
import moment from 'moment';
import InvestmentService from 'services/investments/InvestmentService';

const investmentService = InvestmentService.instance;

/**
 * Cron job that runs daily to recalculate bond investment values.
 *
 * Uses internal calculations to update current value and profit/loss.
 */
const updateBondPricesCron = new CronJob(
    '0 0 7 * * *', // Runs daily at 7 AM UTC
    async () => {
        console.log(`[CRON] Running bond value update at ${moment().format()}`);
        try {
            await investmentService.updateBondPrice();
            console.log(`[CRON] Bond value update completed successfully.`);
        } catch (error) {
            console.error(`[CRON] Failed to update bond values`, error);
        }
    },
    null,
    true,
    'UTC'
);

export default updateBondPricesCron;