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
const responseHandler_1 = require("utils/responseHandler");
const statusCodes_1 = require("constants/statusCodes");
const errorMessages_1 = require("constants/errorMessages");
const successMessages_1 = require("constants/successMessages");
const stripe_1 = __importDefault(require("stripe"));
const UserBaseRespository_1 = __importDefault(require("repositories/base/UserBaseRespository"));
const SubscriptionManagementRepository_1 = __importDefault(require("repositories/subscriptions/SubscriptionManagementRepository"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
const userBaseRepository = new UserBaseRespository_1.default();
const subscriptionRepository = new SubscriptionManagementRepository_1.default();
class WebhookController {
    stripeWebhook(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const sig = request.headers['stripe-signature'];
            let event;
            try {
                event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            }
            catch (error) {
                console.error(`Webhook error: ${error.message}`);
                (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
            }
            // Handle the event
            if ((event === null || event === void 0 ? void 0 : event.type) === 'checkout.session.completed') {
                const session = event.data.object;
                // Expand subscription
                const checkoutSession = yield stripe.checkout.sessions.retrieve(session.id, {
                    expand: ['subscription'],
                });
                const subscription = checkoutSession.subscription;
                const userId = ((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId) || '';
                yield userBaseRepository.updateSubscriptionStatus(userId);
                const paymentDate = new Date();
                const expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + 1);
                const amount = ((_d = (_c = (_b = subscription.items.data[0]) === null || _b === void 0 ? void 0 : _b.price) === null || _c === void 0 ? void 0 : _c.unit_amount) !== null && _d !== void 0 ? _d : 0) / 100;
                const currency = 'INR';
                const paymentMethod = subscription.default_payment_method ? 'card' : 'unknown';
                const transactionId = subscription.id.toString() || '';
                const data = {
                    user_id: userId,
                    plan_name: 'premium',
                    plan_type: 'monthly',
                    payment_date: paymentDate,
                    expiry_date: expiryDate,
                    amount: amount,
                    currency: currency,
                    subscription_mode: 'auto_renewal',
                    status: "active",
                    payment_method: paymentMethod,
                    transaction_id: transactionId,
                };
                yield subscriptionRepository.createSubscription(data);
            }
            (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.ACCEPTED, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { received: true });
        });
    }
}
exports.default = WebhookController;
