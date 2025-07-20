"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubscriptionManagementRepository_1 = __importDefault(require("repositories/subscriptions/SubscriptionManagementRepository"));
const SubscriptionService_1 = __importDefault(require("services/subscriptions/SubscriptionService"));
const SubscriptionController_1 = __importDefault(require("controller/subscriptions/SubscriptionController"));
const SubscriptionRouter_1 = __importDefault(require("./SubscriptionRouter"));
class SubscriptionContainer {
    constructor() {
        const repository = new SubscriptionManagementRepository_1.default();
        const service = new SubscriptionService_1.default(repository);
        this.controller = new SubscriptionController_1.default(service);
        this.router = (0, SubscriptionRouter_1.default)(this.controller);
    }
}
exports.default = SubscriptionContainer;
