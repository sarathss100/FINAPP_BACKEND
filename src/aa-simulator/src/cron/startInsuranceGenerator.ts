import cron from 'node-cron';
import { InsuranceGenerator } from '../generator/insuranceGenerator';

export const generateSingleInsurance = async function() {

    console.log(`Generate random Insurance...`);
    
    try {
        await InsuranceGenerator.generateInsurance();
    } catch (error) {
        console.error(`Single Insurance generation failed`, (error as Error).message);
    }
}

export const startInsuranceGenerator = function() {
    console.log(`Insurance Generator Application Start`);

    // Schedule Job at Every Monday 10.00 AM
    cron.schedule('*0 10 * * 1', async () => {
        console.log(`\nCron Job Triggered - ${new Date().toLocaleString()}`);
        await generateSingleInsurance();
    });

    console.log(`Cron job scheduled: Every Monday 10.00 AM`);
};