import NotificationService from 'services/notification/NotificationService';
import { Server } from 'socket.io';
import registerAdminHandlers from 'sockets/handlers/admin.handler';
import registerChatHandlers from 'sockets/handlers/chat.handler';

import registerNotificationHandlers from 'sockets/handlers/notification.handler';
import { authenticate } from 'sockets/middleware/auth.middleware';

export function setupNamespaces(io: Server): void {
    // Chat Namespace
    const chatNamespace = io.of('/chat');
    chatNamespace.use(authenticate);
    chatNamespace.on('connection', (socket) => {
        registerChatHandlers(socket, io);
    });

    // Notification Namespace
    const notificationNamespace = io.of('/notification');
    notificationNamespace.use(authenticate);
    notificationNamespace.on('connection', (socket) => {
        const notificationService = NotificationService.instance;
        registerNotificationHandlers(socket, notificationService);
    });

    // Admin Namespace
    const adminNamespace = io.of('/admin');
    adminNamespace.use(authenticate);
    adminNamespace.on('connection', (socket) => {
        registerAdminHandlers(socket, io);
    });
}