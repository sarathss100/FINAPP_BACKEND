import logger from '../../config/logger/logger';
import ILogger from './interfaces/ILogger';

class LoggerService implements ILogger {
    info(message: string): void {
        logger.info(message);
    }

    error(message: string, error?: Error): void {
        if (error) {
            logger.error(`${message} - ${error.message}`);
        } else {
            logger.error(message);
        }
    }

    warn(message: string): void {
        logger.warn(message);
    }

    debug(message: string): void {
        logger.debug(message);
    }
}

export default new LoggerService();
