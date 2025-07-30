import { CronJob } from 'cron';
import moment from 'moment';
import IInvestmentService from '../services/investments/interfaces/IInvestmentService';
import InvestmentService from '../services/investments/InvestmentService';

const investmentService: IInvestmentService = InvestmentService.instance;

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