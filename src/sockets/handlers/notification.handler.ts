import { Socket, Server } from 'socket.io';
import INotificationService from '../../services/notification/interfaces/INotificationService';

const registerNotificationHandlers = function(io: Server, socket: Socket, notificationService: INotificationService): void {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;

    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Notification Socket ${socket.id} joined room: ${roomName}`);
        } 

        socket.on('request_notifications', async () => {
            const notifications = await notificationService.getNotifications(accessToken);
            io.of('/notification').to(`user_${userId}`).emit('notifications', notifications);
        });

        socket.on('mark_notification_as_read', async ({ notificationId }) => {
            const isUpdated = await notificationService.updateReadStatus(accessToken, notificationId);
            if (isUpdated) {
                io.of('/notification').to(`user_${userId}`).emit('notification_marked_read', notificationId);
            }
        });

        socket.on('mark_all_notification_as_read', async () => {
            const isUpdated = await notificationService.updateReadStatusAll(accessToken);
            if (isUpdated) {
                io.of('/notification').to(`user_${userId}`).emit('all_notifications_marked_read');
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        socket.emit('error', {
            message: 'Failed to fetch notifications',
        });      
    }
};

export default registerNotificationHandlers;

