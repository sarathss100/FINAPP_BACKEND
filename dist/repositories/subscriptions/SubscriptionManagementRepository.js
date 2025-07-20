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
const mongoose_1 = __importDefault(require("mongoose"));
const SubscriptionModal_1 = require("model/subscription/model/SubscriptionModal");
class SubscriptionManagementRepository {
    constructor() { }
    static get instance() {
        if (!SubscriptionManagementRepository._instance) {
            SubscriptionManagementRepository._instance = new SubscriptionManagementRepository();
        }
        return SubscriptionManagementRepository._instance;
    }
    // Creates a new subscription payment record in the database.
    createSubscription(subscriptionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mongooseUserId = new mongoose_1.default.Types.ObjectId(subscriptionData.user_id);
                yield SubscriptionModal_1.SubscriptionModel.create(Object.assign(Object.assign({}, subscriptionData), { user_id: mongooseUserId }));
            }
            catch (error) {
                console.error('Error creating subscription:', error);
                throw new Error(`Failed to create subscription: ${error.message}`);
            }
        });
    }
    getExpiredSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            try {
                const expiredSubscriptions = yield SubscriptionModal_1.SubscriptionModel.find({
                    expiry_date: { $lt: now },
                    status: 'active',
                });
                const refinedSubscriptions = expiredSubscriptions.map((data) => {
                    var _a;
                    return ({
                        _id: (_a = data._id) === null || _a === void 0 ? void 0 : _a.toString(),
                        user_id: data.user_id.toString(),
                        plan_name: data.plan_name,
                        plan_type: data.plan_type,
                        payment_date: data.payment_date,
                        expiry_date: data.expiry_date,
                        amount: data.amount,
                        currency: data.currency,
                        subscription_mode: data.subscription_mode,
                        status: data.status,
                        payment_method: data.payment_method,
                        transaction_id: data.transaction_id
                    });
                });
                return refinedSubscriptions;
            }
            catch (error) {
                console.error('Error fetching expired subscriptions:', error);
                throw new Error(`Failed to fetch expired subscriptions: ${error.message}`);
            }
        });
    }
    updateSubscriptionStatus(subscriptionId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SubscriptionModal_1.SubscriptionModel.findByIdAndUpdate(subscriptionId, {
                    $set: {
                        status: newStatus
                    }
                });
            }
            catch (error) {
                console.error('Error updating subscription:', error);
                throw new Error(`Failed to update subscriptions: ${error.message}`);
            }
        });
    }
}
exports.default = SubscriptionManagementRepository;
