import cron from 'node-cron';
import { DebtGenerator } from "../generator/debtGenerator";

export const generateSingleDebt = async function() {
    
    console.log(`Generate random debt...`);

    try {
        await DebtGenerator.generateDebt();
    } catch (error) {
        console.error(`Random debt generation failed`, (error as Error).message);
    }
}

export const startDebtGenerator = function() {
    console.log(`Debt Generator Application Start`);
    
    // Run Job at 10:00 AM every Monday
    cron.schedule('*0 10 * * 1', async () => {
        console.log(`\nCron Job Triggered - ${new Date().toLocaleString()}`);
        await generateSingleDebt();
    });

    console.log(`Cron job scheduled: Every Monday 10.00 AM`);
};