import ISubscriptionRepository from './interfaces/ISubscriptionManagemenRepository';
import { SubscriptionModel } from '../../model/subscription/model/SubscriptionModal';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import ISubscriptionDocument from '../../model/subscription/interfaces/ISubscription';
import BaseRepository from '../base_repo/BaseRepository';
export default class SubscriptionRepository implements ISubscriptionRepository {
    private static _instance: SubscriptionRepository;
    private baseRepo: IBaseRepository<ISubscriptionDocument> = new BaseRepository<ISubscriptionDocument>(SubscriptionModel);
    public constructor() { }

    public static get instance(): SubscriptionRepository {
        if (!SubscriptionRepository._instance) {
            SubscriptionRepository._instance = new SubscriptionRepository();
        }
        return SubscriptionRepository._instance;
    }

    async createSubscription(subscriptionData: Partial<ISubscriptionDocument>): Promise<void> {
        try {
            await this.baseRepo.create(subscriptionData);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getExpiredSubscriptions(): Promise<ISubscriptionDocument[]> {
        const now = new Date();
        try {
            const expiredSubscriptions = await this.baseRepo.find({
                expiry_date: { $lt: now },
                status: 'active',
            });

            return expiredSubscriptions;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateSubscriptionStatus(subscriptionId: string, newStatus: 'active' | 'expired' | 'cancelled'): Promise<void> {
        try {
            await this.baseRepo.updateOne(
                { _id: subscriptionId },
                {
                    $set: {
                        status: newStatus
                    }
                }
            );
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

