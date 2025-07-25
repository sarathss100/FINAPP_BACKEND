import SubscriptionManagementRepository from '../../../repositories/subscriptions/SubscriptionManagementRepository';
import SubscriptionService from '../../../services/subscriptions/SubscriptionService';
import ISubscriptionController from '../../../controller/subscriptions/interfaces/ISubscriptionController';
import SubscriptionController from '../../../controller/subscriptions/SubscriptionController';
import createSubscriptionRouter from './SubscriptionRouter';

class SubscriptionContainer {
    public readonly controller: ISubscriptionController;
    public readonly router: ReturnType<typeof createSubscriptionRouter>;

    constructor() {
        const repository = new SubscriptionManagementRepository();
        const service = new SubscriptionService(repository);
        this.controller = new SubscriptionController(service);
        this.router = createSubscriptionRouter(this.controller);
    }
}

export default SubscriptionContainer;