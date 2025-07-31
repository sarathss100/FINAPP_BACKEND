import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../utils/responseHandler';
import { StatusCodes } from '../../constants/statusCodes';
import { ErrorMessages } from '../../constants/errorMessages';
import { SuccessMessages } from '../../constants/successMessages';
import Stripe from 'stripe';
import UserBaseRepository from '../../repositories/base/UserBaseRespository';
import IUserBaseRespository from '../../repositories/base/interfaces/IUserBaseRespository';
import ISubscriptionManagemenRepository from '../../repositories/subscriptions/interfaces/ISubscriptionManagemenRepository';
import SubscriptionManagementRepository from '../../repositories/subscriptions/SubscriptionManagementRepository';
import SubscriptionMapper from '../../mappers/subscriptions/SubscriptionMapper';
import RedisService from '../../services/redis/RedisService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });
const userBaseRepository: IUserBaseRespository = new UserBaseRepository();
const subscriptionRepository: ISubscriptionManagemenRepository = new SubscriptionManagementRepository();

export default class WebhookController {
    async stripeWebhook(request: Request, response: Response): Promise<void> {
        const sig = request.headers['stripe-signature'] as string;
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (error) {
            console.error(`Webhook error: ${(error as Error).message}`);
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            return;
        }

        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || '';

        try {
            switch (event.type) {
                case 'checkout.session.completed': {
                    // Expand subscription info
                    const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, { expand: ['subscription'] });

                    const subscription = checkoutSession.subscription as Stripe.Subscription;

                    // Update user's subscription status in user repo
                    await userBaseRepository.updateSubscriptionStatus(userId);

                    // Prepare subscription data
                    const paymentDate = new Date();
                    const expiryDate = new Date();
                    expiryDate.setMonth(expiryDate.getMonth() + 1);

                    const amount = (subscription.items.data[0]?.price?.unit_amount ?? 0) / 100;

                    const currency = 'INR' as const;

                    const paymentMethod = subscription.default_payment_method ? 'card' : 'unknown';

                    const transactionId = subscription.id.toString() || '';

                    const data = {
                        user_id: userId,
                        plan_name: 'premium' as const,
                        plan_type: 'monthly' as const,
                        payment_date: paymentDate,
                        expiry_date: expiryDate,
                        amount: amount,
                        currency: currency,
                        subscription_mode: 'auto_renewal' as const,
                        status: "active" as const,
                        payment_method: paymentMethod,
                        transaction_id: transactionId,
                    } 

                    // Map and save subscription data 
                    const mappingModel = SubscriptionMapper.toModel(data);

                    await subscriptionRepository.createSubscription(mappingModel);

                    // Remove user's session from Redis - unlock checkout
                    await RedisService.removeUserStripeSession(userId);

                    break;
                }
                case 'checkout.session.expired': {
                    // Session expired without completion - remove Redis lock
                    if (userId) {
                        await RedisService.removeUserStripeSession(userId);
                        console.log(`Stripe session expired, removed Redis key for user ${userId}`);
                    }

                    break;
                }
                default:
                    console.log(`Unhandled Stripe event type: ${event.type}`);
            }
        } catch (processingError) {
            console.error(`Error processing webhook event:`, processingError);
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
        }

        sendSuccessResponse(response, StatusCodes.ACCEPTED, SuccessMessages.OPERATION_SUCCESS, { received: true });
    }
}
