import './config/envConfig/envConfig'; 
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import loggingMiddleware from './middleware/LoggingMiddleware';
import router from './routes/routes';
import cors from 'cors';
import corsOptions from './utils/middleware/corsOptions';
// import rateLimiter from './utils/middleware/rateLimiter';
import helmet from 'helmet';
import './cron/scheduler';
import expireJob from './cron/expireInsurances';
import markExpiryDebts from './cron/DebtMonthlyExpiry';
import markDebtCompleted from './cron/markEndedDebtsAsCompleted.ts';
import updateStockPrice from './cron/updateStockPrices';
import updateMutualFundPrice from './cron/updateMutualFundPrices';
import updateBondPricesCron from './cron/updateBondPrices';
import { startNotificationCronJobs } from './cron/notificationCron';
import { startGoalNotificationCronJob } from './cron/notificationCron';
import { setupSocketListeners } from './sockets/listeners';
import WebhookController from './controller/webhook/WebhookController';

import { startTransactionGenerator } from './aa-simulator/src/cron/startTransactionGenerator';
import  { startDebtGenerator } from './aa-simulator/src/cron/startDebtGenerator';
import { startInsuranceGenerator } from './aa-simulator/src/cron/startInsuranceGenerator';

const app = express();
expireJob.start();
markExpiryDebts.start();
markDebtCompleted.start();
updateStockPrice.start();
updateMutualFundPrice.start();
updateBondPricesCron.start();
startNotificationCronJobs();
startGoalNotificationCronJob();
setupSocketListeners();

startTransactionGenerator();
startDebtGenerator();
startInsuranceGenerator();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggingMiddleware); 
app.use(cors(corsOptions));
app.use(helmet());
// app.use(rateLimiter);

const webhookController = new WebhookController();
app.post(
  '/api/v1/webhook',
  express.raw({ type: 'application/json' }),
  webhookController.stripeWebhook.bind(webhookController)
);

app.use(express.json());

app.use('/api', router);

// Server Health Check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Server is up and Running');
});

export default app;
