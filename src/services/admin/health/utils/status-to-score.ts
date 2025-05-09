export const statusToScore = (status: string): number => {
    switch (status) {
        case 'healthy':
            return 100;
        case 'degraded':
            return 50;
        case 'unhealthy':
            return 0;
        default:
            return 0;
    }
}
