import app from './app';
import mongooseConnection from './config/database/mongooseConnection';
import { setupSocketIO } from './sockets/socket.server';

const PORT: number = parseInt(process.env.PORT || '5000', 10);

(async function () {
    try {
        await mongooseConnection.connect();

        const server = app.listen(PORT, () => {
            console.log(`Server Successfully start on PORT ${PORT}`)
        });

        setupSocketIO(server);

        server.on('error', (error) => {
            console.error(`Server failed to start on PORT ${PORT}:`, error.message);
            process.exit(1);
        });

        process.on('SIGINT', async () => {
            console.log(`Shutting down the application....`);
            await mongooseConnection.disconnect();
            process.exit(0);
        });
    } catch (error) {
        console.error(`MongoDB Connection Failed:`, error instanceof Error ? error.message : error);
        process.exit(1);
    }
})();

