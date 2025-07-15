import { eventBus } from "events/eventBus";
import { io } from "sockets/socket.server";

export const setupSocketListeners = function() {
    eventBus.on('notification_created', (createdNotification) => {
        io.of('/notification').to(`user_${createdNotification.user_id}`).emit('new_notification', createdNotification);
    });

    eventBus.on('account_created', (createdAccount) => {
        try {
            io.of('/accounts').to(`user_${createdAccount.user_id}`).emit('new_account_created', createdAccount);
        } catch (error) {
            console.error('Error emitting account_created:', error);
        }
    });

    eventBus.on('account_removed', (account) => {
        try {
            io.of('/accounts').to(`user_${account.user_id}`).emit('account_deleted', account);
        } catch (error) {
            console.error('Error emitting account_deleted:', error);
        }
    });

    eventBus.on('account_updated', (account) => {
        try {
            io.of('/accounts').to(`user_${account.user_id}`).emit('account_updated', account);
        } catch (error) {
            console.error('Error emitting account_updated:', error);
        }
    });
};