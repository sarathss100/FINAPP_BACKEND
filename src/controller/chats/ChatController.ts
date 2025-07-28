import { sendErrorResponse, sendSuccessResponse } from '../../utils/responseHandler';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { AppError } from '../../error/AppError';
import { SuccessMessages } from '../../constants/successMessages';
import { ZodError } from 'zod';
import IChatController from './interfaces/IChatController';
import IChatService from '../../services/chats/interfaces/IChatService';

class ChatController implements IChatController {
    private readonly _chatService: IChatService;

    constructor(chatService: IChatService) {
        this._chatService = chatService;
    }

    async createChat(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            const { role = 'user', message = '' } = request.body;

            const chat = await this._chatService.createChat(accessToken, role, message );

            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.CHAT_CREATED_SUCCESSFULLY, { chat });
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.errors);
                const errorMessages = error.errors.map(err => {
                    const path = err.path.join('.');
                    return `${path}: ${err.message}`;
                }).join(', ');

                sendErrorResponse(response, StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
            } else if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getAccessToken(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.OPERATION_SUCCESS, { accessToken });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default ChatController;
