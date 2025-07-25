import { Socket } from 'socket.io';
import { decodeAndValidateToken } from '../../utils/auth/tokenUtils';
import { AuthenticationError } from '../../error/AppError';
import { StatusCodes } from '../../constants/statusCodes';
import { ErrorMessages } from '../../constants/errorMessages';

export const authenticate = (socket: Socket, next: (err?: Error) => void): void => {
    const accessToken = socket.handshake.auth?.accessToken || socket.handshake.query?.accessToken;

    if (!accessToken) {
        return next(new AuthenticationError(
            ErrorMessages.ACCESS_TOKEN_NOT_FOUND,
            StatusCodes.UNAUTHORIZED
        ));
    }

    try {
        const userId = decodeAndValidateToken(accessToken);
        if (!userId) {
            throw new AuthenticationError(
                ErrorMessages.USER_ID_MISSING_IN_TOKEN,
                StatusCodes.BAD_REQUEST
            );
        }

        socket.data.userId = userId;
        socket.data.accessToken = accessToken;
        next();
    } catch (error) {
        console.error('Socket authentication failed:', error);
        next(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
};