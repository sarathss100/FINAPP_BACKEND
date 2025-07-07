import { Server } from 'socket.io';
import registerChatHandlers from './handlers/chatHandler';
import { Server as HTTPServer } from 'http';
import registerNotificationHandlers from './handlers/notificationHandler';

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

    io.on('connection', (socket) => {
        registerChatHandlers(socket, io);
        registerNotificationHandlers(socket);
    });

    console.log(`Socket.IO initialized`);
};

export { io };