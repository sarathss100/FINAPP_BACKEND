import mongoose from 'mongoose';
import { IHealthCheck, IHealthStatus } from './interfaces/IHealth';

export class MongoDbHealthCheckService implements IHealthCheck {
    async check(): Promise<IHealthStatus> {
        try {
            const state = mongoose.connection.readyState;
            const isConnected = state === 1; // 1 means connected
            const isConnecting = state === 2; // 2 means connecting
            const isDisconnected = state === 0; // 0 means disconnected

            return {
                status: isConnected ? 'healthy' : isConnecting ? 'degraded' : isDisconnected ? 'unhealthy' : 'degraded',
                score: isConnected ? 100 : isConnecting ? 50 : isDisconnected ? 0 : 50,
                details: `MongoDB connection state: ${isConnected ? 'connected' : isConnecting ? 'connecting' : isDisconnected ? 'disconnected' : 'unknown'}`,
                lastChecked: new Date(),
            }
        } catch (error) {
            return { 
                status: 'unhealthy',
                score: 0,
                details: `MongoDB connection state: disconnected, ${(error as Error).message}`,
                lastChecked: new Date(),
            };
        }
    }
}
