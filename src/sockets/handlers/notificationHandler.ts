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

