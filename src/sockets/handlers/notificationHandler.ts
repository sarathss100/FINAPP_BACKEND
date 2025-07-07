import { Socket } from 'socket.io';
import { decodeAndValidateToken } from '../../utils/auth/tokenUtils';
import { AuthenticationError } from '../../error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import NotificationService from 'services/notification/NotificationService';

/**
 * Handles all notification-related socket events.
 */
export default function registerNotificationHandlers(socket: Socket): void {
    // Event: Client requests notifications
    socket.on('request_notifications', async () => {
        const accessToken = getAccessTokenFromSocket(socket);

        try {
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(
                    ErrorMessages.USER_ID_MISSING_IN_TOKEN,
                    StatusCodes.BAD_REQUEST
                );
            }

            const notifications = await NotificationService.instance.getNotifications(accessToken);

            // Send notifications back
            socket.emit('notifications', notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            socket.emit('error', {
                message: 'Failed to fetch notifications',
            });
        }
    });

    // Event: Mark notification as read
    // socket.on('mark_notification_read', async (notificationId: string) => {
    //     try {
    //         const isUpdated = await NotificationService.instance.updateReadStatus(notificationId);
    //         if (isUpdated) {
    //             socket.emit('notification_marked_read', notificationId);
    //         }
    //     } catch (error) {
    //         console.error('Error marking notification as read:', error);
    //         socket.emit('error', {
    //             message: 'Failed to mark notification as read',
    //         });
    //     }
    // });

    // Event: Archive notification
    // socket.on('archive_notification', async (notificationId: string) => {
    //     try {
    //         const isArchived = await NotificationService.instance.updateArchieveStatus(notificationId);
    //         if (isArchived) {
    //             socket.emit('notification_archived', notificationId);
    //         }
    //     } catch (error) {
    //         console.error('Error archiving notification:', error);
    //         socket.emit('error', {
    //             message: 'Failed to archive notification',
    //         });
    //     }
    // });
}

/**
 * Helper to extract access token from handshake.auth or handshake.query
 */
function getAccessTokenFromSocket(socket: Socket): string {
    return (
        socket.handshake.auth?.accessToken ||
        socket.handshake.query?.accessToken ||
        ''
    );
};

