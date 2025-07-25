import mongoose from 'mongoose';
import ISubscriptionManagemenRepository from './interfaces/ISubscriptionManagemenRepository';
import { SubscriptionModel } from '../../model/subscription/model/SubscriptionModal';
import { SubscriptionDTO } from '../../dtos/subscriptions/subscriptionDTO';

class SubscriptionManagementRepository implements ISubscriptionManagemenRepository {
    private static _instance: SubscriptionManagementRepository;
    public constructor() { }

    public static get instance(): SubscriptionManagementRepository {
        if (!SubscriptionManagementRepository._instance) {
            SubscriptionManagementRepository._instance = new SubscriptionManagementRepository();
        }
        return SubscriptionManagementRepository._instance;
    }

    // Creates a new subscription payment record in the database.
    async createSubscription(subscriptionData: SubscriptionDTO): Promise<void> {
        try {
            const mongooseUserId = new mongoose.Types.ObjectId(subscriptionData.user_id);
            await SubscriptionModel.create({ ...subscriptionData, user_id: mongooseUserId });
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw new Error(`Failed to create subscription: ${(error as Error).message}`);
        }
    }

    async getExpiredSubscriptions(): Promise<SubscriptionDTO[]> {
        const now = new Date();
        try {
            const expiredSubscriptions = await SubscriptionModel.find({
                expiry_date: { $lt: now },
                status: 'active',
            });

            const refinedSubscriptions: SubscriptionDTO[]  = expiredSubscriptions.map((data) => ({
                _id: data._id?.toString(),
                user_id: data.user_id.toString(),
                plan_name: data.plan_name,
                plan_type: data.plan_type,
                payment_date: data.payment_date,
                expiry_date: data.expiry_date,
                amount: data.amount,
                currency: data.currency,
                subscription_mode: data.subscription_mode,
                status: data.status,
                payment_method: data.payment_method,
                transaction_id: data.transaction_id
            }));

            return refinedSubscriptions;
        } catch (error) {
            console.error('Error fetching expired subscriptions:', error);
            throw new Error(`Failed to fetch expired subscriptions: ${(error as Error).message}`);
        }
    }

    async updateSubscriptionStatus(subscriptionId: string, newStatus: 'active' | 'expired' | 'cancelled'): Promise<void> {
        try {
            await SubscriptionModel.findByIdAndUpdate(
                subscriptionId,
                {
                    $set: {
                        status: newStatus
                    }
                }
            );
        } catch (error) {
            console.error('Error updating subscription:', error);
            throw new Error(`Failed to update subscriptions: ${(error as Error).message}`);
        }
    }
}

export default SubscriptionManagementRepository;

