
export interface IHealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    score?: number;
    details?: string;
    checks?: string[];
    lastChecked?: Date;
}

export interface IHealthCheck {
    check: () => Promise<IHealthStatus>;
}
