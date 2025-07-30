import { CronJob } from 'cron';
import moment from 'moment'
import InsuranceService from '../services/insurances/InsuranceService';
import IInsuranceService from '../services/insurances/interfaces/IInsuranceService';

const insuranceService: IInsuranceService = InsuranceService.instance;

const job = new CronJob('0 0 0 * * *', async () => {
    console.log(`[CRON] Running daily expiry check at ${moment().format()}`);
    try {
        await insuranceService.markExpired();
        console.log(`[CRON] Expired insurances updated.`);
    } catch (error) {
        console.error(`[CRON] Failed to update expired insurances`, error);
    }
});

export default job;
