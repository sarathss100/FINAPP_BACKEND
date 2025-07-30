import { TransactionGenerator } from "../generator/transactionGenerator";
import cron from 'node-cron';

export const generateSingleTransaction = async function() {
    console.log(`Generate random transaction...`);

    try {
        await TransactionGenerator.generateTransaction();
    } catch (error) {
        console.error(`Single transaction generation failed`, (error as Error).message);
    }
}

export const startTransactionGenerator = function() {
    console.log(`Transaction Generator Application Start`);

    // Schedule Job at Every 4 hours
    cron.schedule('*0 */4 * * *', async () => {
        console.log(`\nCron Job Triggered - ${new Date().toLocaleString()}`);
        await generateSingleTransaction();
    });

    console.log(`Cron job scheduled: Every 4 Hours`);
};