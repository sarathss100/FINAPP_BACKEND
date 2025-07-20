"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenUtils_1 = require("utils/auth/tokenUtils");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const SubscriptionManagementRepository_1 = __importDefault(require("repositories/subscriptions/SubscriptionManagementRepository"));
const stripe_1 = __importDefault(require("stripe"));
// Initialize Stripe
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
class SubscriptionService {
    constructor(subscriptionRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }
    static get instance() {
        if (!SubscriptionService._instance) {
            const repo = SubscriptionManagementRepository_1.default.instance;
            SubscriptionService._instance = new SubscriptionService(repo);
        }
        return SubscriptionService._instance;
    }
    /**
     * Initiates a Stripe payment by creating a Checkout Session for subscription-based payment.
     * Returns the session URL where the user can complete the payment.
     */
    initiatePayment(accessToken, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Create a Stripe Checkout Session
                const session = yield stripe.checkout.sessions.create({
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
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error initiating payment:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = SubscriptionService;
