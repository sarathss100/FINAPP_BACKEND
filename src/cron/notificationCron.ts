import cron from 'node-cron';
import NotificationService from 'services/notification/NotificationService';

const notificationService = NotificationService.instance;

export const startNotificationCronJobs = function() {
    // Run every day at 4AM
    cron.schedule('0 4 * * *', async () => {
        console.log(`Running scheduled notification checks...`);

        try {
            await notificationService.runScheduledNotifications();
        } catch (error) {
            console.error(`Error running scheduled notifications:`, error);
        }
    });

    console.log( `Notification cron jobs started` );
};

export const startGoalNotificationCronJob = function() {
    // Run once a month on the 3rd at 00.00 (midnight)
    cron.schedule('0 0 3 * *', async () => {
        try {
            await notificationService.checkAndNotifyMonthlyGoalPayments();
            console.log(`Monthly goal notifications processed successfully`);
        } catch (error) {
            console.error(`Failed to process monthly goal notifications:`, error);
        }
    });
};