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
exports.checkAndExpireSubscriptions = void 0;
const UserBaseRespository_1 = __importDefault(require("repositories/base/UserBaseRespository"));
const SubscriptionManagementRepository_1 = __importDefault(require("repositories/subscriptions/SubscriptionManagementRepository"));
const userBaseRepository = new UserBaseRespository_1.default();
const subscriptionRepository = new SubscriptionManagementRepository_1.default();
const checkAndExpireSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Running cron job: Checking expired subscriptions...');
        const expiredSubscriptions = yield subscriptionRepository.getExpiredSubscriptions();
        for (const subscription of expiredSubscriptions) {
            if (!subscription._id)
                continue;
            // Update subscription status in subscription model
            yield subscriptionRepository.updateSubscriptionStatus(subscription._id, 'expired');
            // update user's subscription status
            yield userBaseRepository.updateSubscriptionStatus(subscription.user_id);
            console.log(`Subscription expired for user: ${subscription.user_id}`);
            // await sendSubscriptionExpiredEmail(subscription.user_id);
        }
        console.log(`Cron job completed. Expired ${expiredSubscriptions.length} subscriptions.`);
    }
    catch (error) {
        console.error('Error in cron job:', error);
    }
});
exports.checkAndExpireSubscriptions = checkAndExpireSubscriptions;
