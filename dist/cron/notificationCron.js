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
exports.startGoalNotificationCronJob = exports.startNotificationCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const NotificationService_1 = __importDefault(require("services/notification/NotificationService"));
const notificationService = NotificationService_1.default.instance;
const startNotificationCronJobs = function () {
    // Run every day at 4AM
    node_cron_1.default.schedule('0 4 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log(`Running scheduled notification checks...`);
        try {
            yield notificationService.runScheduledNotifications();
        }
        catch (error) {
            console.error(`Error running scheduled notifications:`, error);
        }
    }));
    console.log(`Notification cron jobs started`);
};
exports.startNotificationCronJobs = startNotificationCronJobs;
const startGoalNotificationCronJob = function () {
    // Run once a month on the 3rd at 00.00 (midnight)
    node_cron_1.default.schedule('0 0 3 * *', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield notificationService.checkAndNotifyMonthlyGoalPayments();
            console.log(`Monthly goal notifications processed successfully`);
        }
        catch (error) {
            console.error(`Failed to process monthly goal notifications:`, error);
        }
    }));
};
exports.startGoalNotificationCronJob = startGoalNotificationCronJob;
