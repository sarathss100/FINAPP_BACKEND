import cron from 'node-cron';
import { DebtGenerator } from "../generator/debtGenerator";

export const generateSingleDebt = async function() {
    console.log(`Generate random debt...`);
    try {
        await DebtGenerator.generateDebt();
    } catch (error) {
        console.error(`Single debt generation failed`, (error as Error).message);
    }
}

export const startDebtGenerator = function() {
    console.log(`Debt Generator Application Start`);
    // Generate initial transaction
    setTimeout(generateSingleDebt, 2000);

    // Schedule cron job for every 10 minutes: */10 * * * * 
    cron.schedule('*/10 * * * *', async () => {
        console.log(`\nCron Job Triggered - ${new Date().toLocaleString()}`);
        await generateSingleDebt();
    });

    console.log(`Cron job scheduled: Every 10 minutes`);
};