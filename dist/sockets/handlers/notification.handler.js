"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const registerNotificationHandlers = function (io, socket, notificationService) {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;
    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Notification Socket ${socket.id} joined room: ${roomName}`);
        }
        socket.on('request_notifications', () => __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notificationService.getNotifications(accessToken);
            io.of('/notification').to(`user_${userId}`).emit('notifications', notifications);
        }));
        socket.on('mark_notification_as_read', (_a) => __awaiter(this, [_a], void 0, function* ({ notificationId }) {
            const isUpdated = yield notificationService.updateReadStatus(accessToken, notificationId);
            if (isUpdated) {
                io.of('/notification').to(`user_${userId}`).emit('notification_marked_read', notificationId);
            }
        }));
        socket.on('mark_all_notification_as_read', () => __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield notificationService.updateReadStatusAll(accessToken);
            if (isUpdated) {
                io.of('/notification').to(`user_${userId}`).emit('all_notifications_marked_read');
            }
        }));
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        socket.emit('error', {
            message: 'Failed to fetch notifications',
        });
    }
};
exports.default = registerNotificationHandlers;
