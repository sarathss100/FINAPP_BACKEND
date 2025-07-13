import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { setupNamespaces } from './namespaces';

let io: Server;

export const setupSocketIO = function(server: HTTPServer): void {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true
        },
        path: '/socket.io',
    });

    setupNamespaces(io);
    console.log(`Socket.IO initialized`);
};

export { io };