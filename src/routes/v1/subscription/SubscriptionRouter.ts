import { Router } from 'express';
import SubscriptionManagementRepository from '../../../repositories/subscriptions/SubscriptionManagementRepository';
import SubscriptionService from '../../../services/subscriptions/SubscriptionService';
import ISubscriptionController from '../../../controller/subscriptions/interfaces/ISubscriptionController';
import SubscriptionController from '../../../controller/subscriptions/SubscriptionController';

const createSubscriptionRouter = function(subscriptionController: ISubscriptionController): Router {
    const router = Router();

    router.post('/checkout', subscriptionController.initiatePayment.bind(subscriptionController));

    return router;
};

export default createSubscriptionRouter;