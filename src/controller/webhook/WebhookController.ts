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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });
const userBaseRepository: IUserBaseRespository = new UserBaseRepository();
const subscriptionRepository: ISubscriptionManagemenRepository = new SubscriptionManagementRepository();

class WebhookController {

    async stripeWebhook(request: Request, response: Response): Promise<void> {
        const sig = request.headers['stripe-signature'] as string;
        let event;

        try {
            event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (error) {
            console.error(`Webhook error: ${(error as Error).message}`);
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
        }

        // Handle the event
        if (event?.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Expand subscription
            const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
               expand: ['subscription'], 
            });

            const subscription = checkoutSession.subscription as Stripe.Subscription;

            const userId = session.metadata?.userId || '';
            await userBaseRepository.updateSubscriptionStatus(userId);

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
        
            await subscriptionRepository.createSubscription(data);

        }

        sendSuccessResponse(response, StatusCodes.ACCEPTED, SuccessMessages.OPERATION_SUCCESS, { received: true });

    }
}

export default WebhookController;
