import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import { setupNamespaces } from './namespaces';

let io: Server;

export const setupSocketIO = function(server: HTTPServer): void {
    const socketOrigins = [
        'https://finapp-frontend-eta.vercel.app',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ];

    io = new Server(server, {
        cors: {
            origin: socketOrigins,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true,
            allowEIO3: true
        },
        path: '/socket.io',
    });

    setupNamespaces(io);
    console.log(`Socket.IO initialized`);
};

export { io };
