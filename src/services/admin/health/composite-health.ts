import { IHealthCheck, IHealthStatus } from './interfaces/IHealth';
import { statusToScore } from './utils/status-to-score';

export class CompositeHealthCheckService implements IHealthCheck {
    private checks: IHealthCheck[];

    constructor(checks: IHealthCheck[]) {
        this.checks = checks;
    }

    async check(): Promise<IHealthStatus> {
        const results = await Promise.all(this.checks.map(check => check.check()));

        const scoredResults = results.map(result => ({
            ...result,
            score: statusToScore(result.status),
        }));

        const totalScore = scoredResults.reduce((acc, result) => acc + result.score, 0);
        const averageScore = totalScore / scoredResults.length;

        const finalStatus: 'healthy' | 'degraded' | 'unhealthy' = averageScore >= 0.75 ? 'healthy' : averageScore >= 0.5 ? 'degraded' : 'unhealthy';

        const allDetails = scoredResults.reduce<string[]>((acc, result) => {
            if (result.details) {
                acc.push(result.details);
            }
            return acc;
        }, []);

        return {
            status: finalStatus,
            score: averageScore,
            details: averageScore >= 0.75 ? 'All systems are operational' : averageScore >= 0.5 ? 'Some systems are degraded' : 'Some systems are down',
            checks: allDetails,
            lastChecked: new Date()
        }
    }
}
