import { IHealthCheck, IHealthStatus } from './interfaces/IHealth';

export class ServerHealthCheckService implements IHealthCheck {
    async check(): Promise<IHealthStatus> { 
        const uptime = process.uptime();
        if (uptime <= 0) {
            return {
                status: 'unhealthy',
                details: 'Server uptime is negative',
                lastChecked: new Date(),
            }
        } else if (uptime < 60) { // less than 1 minute
            return {
                status: 'degraded',
                details: `Server uptime is ${String(process.uptime().toFixed(2))} seconds`,
                lastChecked: new Date(),
            }
        } 
         // healthy if uptime is greater than 1 minute
        return {
            status: 'healthy',
            details: `Server uptime is ${String(process.uptime().toFixed(2))} seconds`,
            lastChecked: new Date(),
        }
    }
}
