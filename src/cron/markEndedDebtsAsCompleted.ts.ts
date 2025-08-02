import { CronJob } from 'cron';
import moment from 'moment';
import DebtService from '../services/debt/DebtService';
import IDebtService from '../services/debt/interfaces/IDebtService';

const debtService: IDebtService = DebtService.instance;

const markDebtCompleted = new CronJob('0 0 * * *', async () => {
    console.log(`[CRON] Running daily debt expiry check at ${moment().format()}`);
    try {
        await debtService.markEndedDebtsAsCompleted();
        console.log(`[CRON] Debt expiry check completed successfully.`);
    } catch (error) {
        console.error(`[CRON] Failed to complete debt expiry check`, error);
    }
});

export default markDebtCompleted;
