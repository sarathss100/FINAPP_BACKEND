import cron from 'node-cron';
import logger from 'config/logger/logger';
import MutualFundService from 'services/mutualfunds/MutualFundService';
import IMutualFundService from 'services/mutualfunds/interfaces/IMutualFundService';

const mutualFundService: IMutualFundService = MutualFundService.instance;

// Schedule job to run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
    logger.info('Starting daily NAV synchronization...');

    try {
        const isSynched = await mutualFundService.syncNavData();
        if (isSynched) {
            logger.info(`NAV data synchronized successfully.`);
        } else {
            logger.warn(`NAV data synchornization completed but no changes were made.`);
        }
    } catch (error) {
        logger.error(`Error during NAV synchronization: ${( error as Error).message}`)
    }
});
