import { ErrorMessages } from "constants/errorMessages";
import { StatusCodes } from "constants/statusCodes";
import { AuthenticationError } from "error/AppError";
import mongoose from "mongoose";
import { decodeAndValidateToken } from "utils/auth/tokenUtils";
import { Socket, Server } from "socket.io";
import ChatSocketService from "sockets/services/chatSocketService";

// Extend the Socket interface to include userId
declare module "socket.io" {
    interface Socket {
        userId?: string;
    }
}

const registerChatHandlers = function(socket: Socket, io: Server): void {
    const { accessToken } = socket.handshake.auth || socket.handshake.query || {};
    if (!accessToken) {
        socket.emit(`auth_error`, 'Missing access token');
        socket.disconnect();
        return;
    }

    try {
        const userId = decodeAndValidateToken(accessToken);
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
        }

        socket.userId = userId;
        socket.join(userId);

        console.log(`User ${userId} connected and joined room`);

        const chatSocketService = new ChatSocketService();

        socket.on('user_message', async (payload) => {
            await chatSocketService.handleMessage(socket, io, payload);
        });

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });
    } catch (error) {
        console.error(`Socket auth failed:`, error);
        socket.emit('auth_error', (error as Error).message || 'Authentication failed');
        socket.disconnect();
    }
};

export default registerChatHandlers;