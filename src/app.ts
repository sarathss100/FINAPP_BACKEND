import './config/envConfig/envConfig'; 
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import loggingMiddleware from './middleware/LoggingMiddleware';
import router from './routes/routes';
import cors from 'cors';
import corsOptions from './utils/middleware/corsOptions';
import rateLimiter from './utils/middleware/rateLimiter';
import helmet from 'helmet';
import './cron/scheduler';
import { setupSocketListeners } from './sockets/listeners';
import startAllCrons from './cron/startAllcrons';
import WebhookController from './controller/webhook/WebhookController';
// import { startTransactionGenerator } from './aa-simulator/src/cron/startTransactionGenerator';
// import  { startDebtGenerator } from './aa-simulator/src/cron/startDebtGenerator';
// import { startInsuranceGenerator } from './aa-simulator/src/cron/startInsuranceGenerator';

const app = express();

setupSocketListeners();
startAllCrons();
// startTransactionGenerator();
// startDebtGenerator();
// startInsuranceGenerator();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggingMiddleware); 
app.use(cors(corsOptions));
app.use(helmet());
app.use(rateLimiter);

const webhookController = new WebhookController();

app.post(
  '/api/v1/webhook',
  express.raw({ type: 'application/json' }),
  webhookController.stripeWebhook.bind(webhookController)
);

app.use(express.json());

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Server is up and Running');
});

export default app;
