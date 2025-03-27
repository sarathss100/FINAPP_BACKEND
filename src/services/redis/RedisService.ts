import Redis from 'ioredis';

// Initialize Redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '13957', 10),
    password: process.env.REDIS_PASSWORD
});

class RedisService {
    /**
     * Store a refresh token in Redis.
     * @param userId The ID of the user.
     * @param refreshToken The refresh token to store.
     * @param ttl The time-to-live (TTL) for the token in seconds.
     */
    async storeRefreshToken(userId: string, refreshToken: string, ttl: number): Promise<void> {
        await redisClient.set(`refresh_token:${userId}`, refreshToken, 'EX', ttl);
    } 

    /**
     * Delete a refresh token from redis 
     * @param userId The ID of the user.
     */
    async deleteRefreshToken(userId: string): Promise<void> {
        await redisClient.del(`refresh_token:${userId}`);
    }
}

export default new RedisService();
