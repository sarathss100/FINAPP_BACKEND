import cron from 'cron';
import moment from 'moment'
import InsuranceService from 'services/insurances/InsuranceService';

const insuranceService = InsuranceService.instance;

// Run daily at 12.00 AM (UTC time)
const job = new cron.CronJob('0 0 0 * * *', async () => {
    console.log(`[CRON] Running daily expiry check at ${moment().format()}`);
    try {
        await insuranceService.markExpired();
        console.log(`[CRON] Expired insurances updated.`);
    } catch (error) {
        console.error(`[CRON] Failed to update expired insurances`, error);
    }
});

export default job;
