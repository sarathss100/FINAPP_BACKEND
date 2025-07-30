import ISubscriptionDocument from '../../../model/subscription/interfaces/ISubscription';

export default interface ISubscriptionRepository {
    createSubscription(subscriptionData: Partial<ISubscriptionDocument>): Promise<void>;
    getExpiredSubscriptions(): Promise<ISubscriptionDocument[]>;
    updateSubscriptionStatus(subscriptionId: string, newStatus: 'active' | 'expired' | 'cancelled'): Promise<void>;
}