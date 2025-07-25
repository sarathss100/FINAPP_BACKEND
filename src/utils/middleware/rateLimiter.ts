import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20000,
    message: `Too many requests, please try again later.`,
    standardHeaders: true,
    legacyHeaders: false,
});

export default rateLimiter;
