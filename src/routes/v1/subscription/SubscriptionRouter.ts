import { Router } from 'express';
import SubscriptionManagementRepository from '../../../repositories/subscriptions/SubscriptionManagementRepository';
import SubscriptionService from '../../../services/subscriptions/SubscriptionService';
import ISubscriptionController from '../../../controller/subscriptions/interfaces/ISubscriptionController';
import SubscriptionController from '../../../controller/subscriptions/SubscriptionController';

const router = Router();
const subscriptionRepository = new SubscriptionManagementRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController: ISubscriptionController = new SubscriptionController(subscriptionService);

router.post('/checkout', subscriptionController.initiatePayment.bind(subscriptionController));

export default router;