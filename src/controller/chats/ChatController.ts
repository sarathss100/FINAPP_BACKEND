import { sendSuccessResponse } from '../../utils/responseHandler';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { SuccessMessages } from '../../constants/successMessages';
import IChatController from './interfaces/IChatController';
import IChatService from '../../services/chats/interfaces/IChatService';
import { handleControllerError } from '../../utils/controllerUtils';

export default class ChatController implements IChatController {
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
            handleControllerError(response, error);
        }
    }

    async getAccessToken(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.OPERATION_SUCCESS, { accessToken });
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}
