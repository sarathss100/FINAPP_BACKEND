import { Router } from 'express';
import ISubscriptionController from '../../../controller/subscriptions/interfaces/ISubscriptionController';

const createSubscriptionRouter = function(subscriptionController: ISubscriptionController): Router {
    const router = Router();

    router.post('/checkout', subscriptionController.initiatePayment.bind(subscriptionController));

    return router;
};

export default createSubscriptionRouter;