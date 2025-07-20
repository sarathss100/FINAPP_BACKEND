"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SubscriptionManagementRepository_1 = __importDefault(require("repositories/subscriptions/SubscriptionManagementRepository"));
const SubscriptionService_1 = __importDefault(require("services/subscriptions/SubscriptionService"));
const SubscriptionController_1 = __importDefault(require("controller/subscriptions/SubscriptionController"));
const router = (0, express_1.Router)();
const subscriptionRepository = new SubscriptionManagementRepository_1.default();
const subscriptionService = new SubscriptionService_1.default(subscriptionRepository);
const subscriptionController = new SubscriptionController_1.default(subscriptionService);
router.post('/checkout', subscriptionController.initiatePayment.bind(subscriptionController));
exports.default = router;
