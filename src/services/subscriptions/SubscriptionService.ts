import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import IInsuranceService from './interfaces/ISubscriptionService';
import ISubscriptionManagemenRepository from 'repositories/subscriptions/interfaces/ISubscriptionManagemenRepository';
import SubscriptionManagementRepository from 'repositories/subscriptions/SubscriptionManagementRepository';
import { initiatePaymentDTO } from 'dtos/subscriptions/subscriptionDTO';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

class SubscriptionService implements IInsuranceService {
    private static _instance: SubscriptionService;
    private _subscriptionRepository: ISubscriptionManagemenRepository;

    constructor(subscriptionRepository: ISubscriptionManagemenRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }

    public static get instance(): SubscriptionService {
        if (!SubscriptionService._instance) {
            const repo = SubscriptionManagementRepository.instance;
            SubscriptionService._instance = new SubscriptionService(repo);
        }
        return SubscriptionService._instance;
    }

    /**
     * Initiates a Stripe payment by creating a Checkout Session for subscription-based payment.
     * Returns the session URL where the user can complete the payment.
     */
    async initiatePayment(accessToken: string, formData: initiatePaymentDTO): Promise<string> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
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
            });

            return session.url || '';
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error initiating payment:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default SubscriptionService;
