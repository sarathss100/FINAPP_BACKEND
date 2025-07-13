import { Socket } from 'socket.io';
import { decodeAndValidateToken } from '../../utils/auth/tokenUtils';
import { AuthenticationError } from '../../error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import INotificationService from 'services/notification/interfaces/INotificationService';

export default function registerNotificationHandlers(socket: Socket, notificationService: INotificationService): void {
    const accessToken = getAccessTokenFromSocket(socket);

    try {
        const userId = decodeAndValidateToken(accessToken);
        if (!userId) {
            throw new AuthenticationError(
                ErrorMessages.USER_ID_MISSING_IN_TOKEN,
                StatusCodes.BAD_REQUEST
            );
        }   

        socket.join(`user_${userId}`);

        socket.on('request_notifications', async () => {
            const notifications = await notificationService.getNotifications(accessToken);
            socket.emit('notifications', notifications);
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        socket.emit('error', {
            message: 'Failed to fetch notifications',
        });      
    }
}

function getAccessTokenFromSocket(socket: Socket): string {
    return (
        socket.handshake.auth?.accessToken ||
        socket.handshake.query?.accessToken ||
        ''
    );
};

