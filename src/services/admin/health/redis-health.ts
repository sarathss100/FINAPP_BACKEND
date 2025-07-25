import RedisService from '../../../services/redis/RedisService';
import { IHealthCheck, IHealthStatus } from './interfaces/IHealth';

const client = RedisService.getClient();

export class RedisHealthCheckService implements IHealthCheck {
    async check(): Promise<IHealthStatus> {
        try {
            const pingResponse = await client.ping();
            if (pingResponse === 'PONG') {
                return {
                    status: 'healthy',
                    score: 100,
                    details: 'Redis is healthy',
                    lastChecked: new Date(),
                };
            } else {
                return {
                    status: 'unhealthy',
                    score: 0,
                    details: 'Redis is not responding as expected',
                    lastChecked: new Date(),
                };
            }
        } catch (error) {
            return {
                status: 'unhealthy',
                score: 0,
                details: `Redis check failed: ${(error as Error).message}`,
                lastChecked: new Date(),
            };
        }
    }
}
