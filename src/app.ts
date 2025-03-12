import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import loggingMiddleware from './middleware/LoggingMiddleware';
import mongooseConnection from './config/mongooseConnection';
import router from './routes/routes';

dotenv.config();
const app = express();
const PORT: number = parseInt(process.env.PORT || `3000`, 10);
mongooseConnection.connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggingMiddleware);

app.use('/api', router);

// Server Health Check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Server is up and Running');
});

// Start the server
app.listen(PORT, (error?: Error) => {
    if (error) {
        console.error(`Server failed to start on PORT ${PORT}:`, error.message);
    } else {
        console.log(`Server Successfully start on PORT ${PORT}`)
    }
});