import IUserBaseRespository from '../repositories/base/interfaces/IUserBaseRespository';
import UserBaseRepository from '../repositories/base/UserBaseRespository';
import ISubscriptionManagemenRepository from '../repositories/subscriptions/interfaces/ISubscriptionManagemenRepository';
import SubscriptionManagementRepository from '../repositories/subscriptions/SubscriptionManagementRepository';

const userBaseRepository: IUserBaseRespository = new UserBaseRepository();
const subscriptionRepository: ISubscriptionManagemenRepository = new SubscriptionManagementRepository(); 

export const checkAndExpireSubscriptions = async () => {
    try {
        console.log('Running cron job: Checking expired subscriptions...');

        const expiredSubscriptions = await subscriptionRepository.getExpiredSubscriptions();

        for (const subscription of expiredSubscriptions) {
            if (!subscription._id) continue;
            // Update subscription status in subscription model
            await subscriptionRepository.updateSubscriptionStatus(subscription._id?.toString(), 'expired');

            // update user's subscription status
            await userBaseRepository.updateSubscriptionStatus(subscription.user_id?.toString());

            console.log(`Subscription expired for user: ${subscription.user_id}`);
            // await sendSubscriptionExpiredEmail(subscription.user_id);
        }

        console.log(`Cron job completed. Expired ${expiredSubscriptions.length} subscriptions.`);
    } catch (error) {
        console.error('Error in cron job:', error);
    }
};

