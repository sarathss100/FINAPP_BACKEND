import { CronJob } from 'cron';
import moment from 'moment';
import DebtService from 'services/debt/DebtService';

const debtService = DebtService.instance;

/**
 * Cron job that runs daily at midnight (UTC) to check and update expired debts.
 *
 * Any debt with a nextDueDate earlier than the current date will be marked as expired.
 */
const markDebtCompleted = new CronJob('0 0 0 * * *', async () => {
    console.log(`[CRON] Running daily debt expiry check at ${moment().format()}`);
    try {
        await debtService.markEndedDebtsAsCompleted();
        console.log(`[CRON] Debt expiry check completed successfully.`);
    } catch (error) {
        console.error(`[CRON] Failed to complete debt expiry check`, error);
    }
});

export default markDebtCompleted;
