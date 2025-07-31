import IInsuranceService from './interfaces/ISubscriptionService';
import ISubscriptionRepository from '../../repositories/subscriptions/interfaces/ISubscriptionManagemenRepository';
import SubscriptionRepository from '../../repositories/subscriptions/SubscriptionManagementRepository';
import { initiatePaymentDTO } from '../../dtos/subscriptions/subscriptionDTO';
import Stripe from 'stripe';
import { extractUserIdFromToken, wrapServiceError } from '../../utils/serviceUtils';
import RedisService from '../redis/RedisService';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

export default class SubscriptionService implements IInsuranceService {
    private static _instance: SubscriptionService;
    private _subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }

    public static get instance(): SubscriptionService {
        if (!SubscriptionService._instance) {
            const repo = SubscriptionRepository.instance;
            SubscriptionService._instance = new SubscriptionService(repo);
        }
        return SubscriptionService._instance;
    }

    async initiatePayment(accessToken: string, formData: initiatePaymentDTO): Promise<string> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Check Redis if session exists for user
            const existingSessionId = await RedisService.getUserStripeSession(userId);

            if (existingSessionId) {
                const session = await stripe.checkout.sessions.retrieve(existingSessionId);
                if (session && session.url) {
                    return session.url;
                }
            }

            // Create a Stripe Checkout Session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [
                    {
                        price_data: {
                            currency: formData.currency,
                            product_data: {
                                name: `Premium Plan - ${formData.plan}`
                            },
                            unit_amount: Math.round(formData.amount * 100),
                            recurring: {
                                interval: 'month',
                                interval_count: 1,
                            }
                        }, 
                        quantity: 1,
                    }
                ],
                metadata: {
                    userId
                },
                success_url: `${process.env.FRON_END_URL}/payment/success`,
                cancel_url: `${process.env.FRON_END_URL}/payment/failure`,
                client_reference_id: userId,
            });

            if (!session.url) {
                throw new Error(`Failed to create Stripe session URL`);
            }

            // Save session ID to Redis with expiration
            await RedisService.saveUserStripeSession(userId, session.id);

            return session.url;
        } catch (error) {
            console.error('Error initiating payment:', error);
            throw wrapServiceError(error);
        }
    }
}