import './config/envConfig/envConfig'; // Load dotenv globally
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import loggingMiddleware from './middleware/LoggingMiddleware';
import router from './routes/routes';
import cors from 'cors';
import corsOptions from 'utils/middleware/corsOptions';
// import rateLimiter from 'utils/middleware/rateLimiter';
import helmet from 'helmet';
// import apiRouter from 'routes/v1/onemoney/api.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggingMiddleware); 
app.use(cors(corsOptions));
app.use(helmet());
// app.use(rateLimiter);
// app.use('/api/onemoney', apiRouter);
app.use('/api', router);

// Server Health Check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Server is up and Running');
});

export default app;
