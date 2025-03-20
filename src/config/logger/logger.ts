import winston from 'winston';

const customFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

const logger = winston.createLogger({
    level: `info`,
    format: customFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `system.log` }),
    ],
});

export default logger;
