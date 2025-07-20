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
const responseHandler_1 = require("utils/responseHandler");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const AppError_1 = require("error/AppError");
const successMessages_1 = require("constants/successMessages");
const zod_1 = require("zod");
// import { chatDTOSchema } from 'validation/chats/chat.validation';
class ChatController {
    /**
     * @constructor
     * @param {IChatService} chatService - The service implementation to handle business logic.
     */
    constructor(chatService) {
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
    createChat(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Validate request body against the Zod schema
                // const dto = chatDTOSchema.parse(request.body);
                const { role = 'user', message = '' } = request.body;
                // Delegate to the service layer
                const chat = yield this._chatService.createChat(accessToken, role, message);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.CREATED, successMessages_1.SuccessMessages.CHAT_CREATED_SUCCESSFULLY, { chat });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
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
    getAccessToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.CREATED, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { accessToken });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = ChatController;
