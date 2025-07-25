import { SubscriptionDTO } from '../../../dtos/subscriptions/subscriptionDTO';

interface ISubscriptionManagemenRepository {
    createSubscription(subscriptionData: SubscriptionDTO): Promise<void>;
    getExpiredSubscriptions(): Promise<SubscriptionDTO[]>;
    updateSubscriptionStatus(subscriptionId: string, newStatus: 'active' | 'expired' | 'cancelled'): Promise<void>;
}

export default ISubscriptionManagemenRepository;
