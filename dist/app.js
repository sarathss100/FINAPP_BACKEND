"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/envConfig/envConfig"); // Load dotenv globally
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const LoggingMiddleware_1 = __importDefault(require("./middleware/LoggingMiddleware"));
const routes_1 = __importDefault(require("./routes/routes"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("utils/middleware/corsOptions"));
// import rateLimiter from 'utils/middleware/rateLimiter';
const helmet_1 = __importDefault(require("helmet"));
require("./cron/scheduler");
const expireInsurances_1 = __importDefault(require("./cron/expireInsurances"));
const DebtMonthlyExpiry_1 = __importDefault(require("./cron/DebtMonthlyExpiry"));
const markEndedDebtsAsCompleted_ts_1 = __importDefault(require("./cron/markEndedDebtsAsCompleted.ts"));
const updateStockPrices_1 = __importDefault(require("cron/updateStockPrices"));
const updateMutualFundPrices_1 = __importDefault(require("cron/updateMutualFundPrices"));
const updateBondPrices_1 = __importDefault(require("cron/updateBondPrices"));
const notificationCron_1 = require("cron/notificationCron");
const notificationCron_2 = require("cron/notificationCron");
const listeners_1 = require("sockets/listeners");
const WebhookController_1 = __importDefault(require("controller/webhook/WebhookController"));
const startTransactionGenerator_1 = require("aa-simulator/src/cron/startTransactionGenerator");
const startDebtGenerator_1 = require("aa-simulator/src/cron/startDebtGenerator");
const startInsuranceGenerator_1 = require("aa-simulator/src/cron/startInsuranceGenerator");
const app = (0, express_1.default)();
expireInsurances_1.default.start();
DebtMonthlyExpiry_1.default.start();
markEndedDebtsAsCompleted_ts_1.default.start();
updateStockPrices_1.default.start();
updateMutualFundPrices_1.default.start();
updateBondPrices_1.default.start();
(0, notificationCron_1.startNotificationCronJobs)();
(0, notificationCron_2.startGoalNotificationCronJob)();
(0, listeners_1.setupSocketListeners)();
(0, startTransactionGenerator_1.startTransactionGenerator)();
(0, startDebtGenerator_1.startDebtGenerator)();
(0, startInsuranceGenerator_1.startInsuranceGenerator)();
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(LoggingMiddleware_1.default);
app.use((0, cors_1.default)(corsOptions_1.default));
app.use((0, helmet_1.default)());
// app.use(rateLimiter);
const webhookController = new WebhookController_1.default();
app.post('/api/v1/webhook', express_1.default.raw({ type: 'application/json' }), webhookController.stripeWebhook.bind(webhookController));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
// Server Health Check
app.get('/', (req, res) => {
    res.status(200).json('Server is up and Running');
});
exports.default = app;
