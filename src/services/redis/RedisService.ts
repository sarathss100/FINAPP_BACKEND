import Redis from 'ioredis';

// Initialize Redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '13957', 10),
    password: process.env.REDIS_PASSWORD
});

const REDIS_KEY_PREFIX = 'user_stripe_session:';

class RedisService {
    getClient(): Redis {
        return redisClient;
    }

    async storeRefreshToken(userId: string, refreshToken: string, ttl: number): Promise<void> {
        await redisClient.set(`refresh_token:${userId}`, refreshToken, 'EX', ttl);
    } 

    async getRefreshToken(userId: string): Promise<string | null> {
        return await redisClient.get(`refresh_token:${userId}`);
    }
    
    async deleteRefreshToken(userId: string): Promise<boolean | undefined> {
        const response = await redisClient.del(`refresh_token:${userId}`);
        if (response === 1) {
            return true;
        } 
    }

    async saveUserStripeSession(userId: string, sessionId: string): Promise<void> {
        // Set with expiration 30 minutes
        const key = REDIS_KEY_PREFIX + userId;
        await redisClient.set(key, sessionId, 'EX', 1800);
    }

    async getUserStripeSession(userId: string): Promise<string | null> {
        const key = REDIS_KEY_PREFIX + userId;
        return await redisClient.get(key);
    }

    async removeUserStripeSession(userId: string): Promise<void> {
        const key = REDIS_KEY_PREFIX + userId;
        await redisClient.del(key);
    }
}

export default new RedisService();
