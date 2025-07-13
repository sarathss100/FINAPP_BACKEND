import { Server } from 'socket.io';
import registerChatHandlers from './handlers/chatHandler';
import { Server as HTTPServer } from 'http';
import registerNotificationHandlers from './handlers/notificationHandler';
import registerAdminHandlers from './handlers/adminSocketHandlers';
import NotificationService from 'services/notification/NotificationService';

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
        const clientType = socket.handshake.auth.clientType;
        if (clientType === 'admin') {
            registerAdminHandlers(socket, io);
        } else if (clientType === 'user') {
            registerChatHandlers(socket, io);
        } else {
            registerNotificationHandlers(socket, NotificationService.instance);
        }
    });

    console.log(`Socket.IO initialized`);
};

export { io };