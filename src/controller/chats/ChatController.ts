import { sendErrorResponse, sendSuccessResponse } from '../../utils/responseHandler';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { AppError } from '../../error/AppError';
import { SuccessMessages } from '../../constants/successMessages';
import { ZodError } from 'zod';
import IChatController from './interfaces/IChatController';
import IChatService from '../../services/chats/interfaces/IChatService';
// import { chatDTOSchema } from 'validation/chats/chat.validation';

class ChatController implements IChatController {
    private readonly _chatService: IChatService;

    /**
     * @constructor
     * @param {IChatService} chatService - The service implementation to handle business logic.
     */
    constructor(chatService: IChatService) {
        this._chatService = chatService;
    }

    /**
     * @method createChat
     * @description Handles incoming requests to create a new chat record.
     * Extracts the access token from cookies, validates the request body using Zod schema,
     * and delegates creation logic to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    async createChat(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Validate request body against the Zod schema
            // const dto = chatDTOSchema.parse(request.body);

            const { role = 'user', message = '' } = request.body;

            // Delegate to the service layer
            const chat = await this._chatService.createChat(accessToken, role, message );

            // Send success response
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.CHAT_CREATED_SUCCESSFULLY, { chat });
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.errors);
                // Format Zod validation errors
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

    /**
     * @method createChat
     * @description Handles incoming requests to create a new chat record.
     * Extracts the access token from cookies, validates the request body using Zod schema,
     * and delegates creation logic to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    async getAccessToken(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Send success response
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
