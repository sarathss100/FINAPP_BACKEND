import { eventBus } from "events/eventBus";
import { io } from "sockets/socket.server";

export const setupSocketListeners = function() {
    eventBus.on('notification_created', (createdNotification) => {
        io.of('/notification').to(`user_${createdNotification.user_id}`).emit('new_notification', createdNotification);
    });
};