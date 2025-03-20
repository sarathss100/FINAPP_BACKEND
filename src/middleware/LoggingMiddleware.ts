import expressWinston from 'express-winston';
import logger from 'config/logger/logger';

const loggingMiddleware = expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
    msg: `HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms`,
    meta: true,
    expressFormat: true,
    colorize: false
});

export default loggingMiddleware;
