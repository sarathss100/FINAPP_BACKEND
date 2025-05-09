import axios from 'axios';
import { IHealthCheck, IHealthStatus } from './interfaces/IHealth';

export class ExternalApiHealthCheckService implements IHealthCheck {
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async check(): Promise<IHealthStatus> {
        try {
            const start = Date.now();
            const res = await axios.get(this.url, { timeout: 5000 });
            const latency = Date.now() - start;

            return {
                status: res.status >= 200 && res.status < 300 ? 'healthy' : 'degraded',
                score: res.status >= 200 && res.status < 300 ? 100 : 50,
                details: `Latency : ${latency}ms`,
                lastChecked: new Date(),
            }
        } catch (error) {
            console.error(`Health check failed for ${this.url}:`, error);
            return {
                status: 'unhealthy',
                score: 0,
                details: (error as Error).message,
                lastChecked: new Date(),
            }
        }
    }
}
