import expireJob from './expireInsurances';
import markExpiryDebts from './DebtMonthlyExpiry';
import markDebtCompleted from './markEndedDebtsAsCompleted.ts';
import updateStockPrice from './updateStockPrices';
import updateMutualFundPrice from './updateMutualFundPrices';
import updateBondPricesCron from './updateBondPrices';
import { startNotificationCronJobs, startGoalNotificationCronJob } from './notificationCron';

const startAllCrons = function() {
    expireJob.start();
    markExpiryDebts.start();
    markDebtCompleted.start();
    updateStockPrice.start();
    updateMutualFundPrice.start();
    updateBondPricesCron.start();
    startNotificationCronJobs();
    startGoalNotificationCronJob();
};

export default startAllCrons;