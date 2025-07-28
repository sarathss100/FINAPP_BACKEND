import { sendErrorResponse, sendSuccessResponse } from '../../utils/responseHandler'; 
import { ErrorMessages } from '../../constants/errorMessages'; 
import { StatusCodes } from '../../constants/statusCodes'; 
import { Request, Response } from 'express'; 
import { AppError, AuthenticationError, ValidationError } from '../../error/AppError'; 
import { SuccessMessages } from '../../constants/successMessages'; 
import INotificationController from './interfaces/INotificationController';
import INotificationService from '../../services/notification/interfaces/INotificationService';
import notificationDTOSchema from '../../validation/notification/notification.validation';

class NotificationController implements INotificationController {
    private readonly _notificationService: INotificationService;

    constructor(notificaitonService: INotificationService) {
        this._notificationService = notificaitonService;
    }

    async createNotification(request: Request, response: Response): Promise<void> {
        try {
            // Extract the access token from cookies
            const { accessToken } = request.cookies;

            // If no access token is found, throw an authentication error
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Validate the incoming request body using the Zod schema
            const parsedBody = notificationDTOSchema.safeParse(request.body);

            // If validation fails, extract and log the validation errors
            if (!parsedBody.success) {
                const errors = parsedBody.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                console.error(errors);

                // Throw a validation error to be caught and handled below
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }

            // Extract the validated notification data from the parsed body
            const notificationData = parsedBody.data;

            // Use the service layer to create the notification
            const createdNotification = await this._notificationService.createNotification(accessToken, notificationData);

            // Send a success response with the created notification
            sendSuccessResponse(
                response,
                StatusCodes.OK,
                SuccessMessages.OPERATION_SUCCESS,
                { createdNotification }
            );
        } catch (error) {
            // Handle known application errors by sending appropriate HTTP response
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                // Catch any unexpected errors and return a generic server error response
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getNotifications(request: Request, response: Response): Promise<void> {
        try {
            // Extract the access token from cookies
            const { accessToken } = request.cookies;

            // If no access token is found, throw an authentication error
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Use the service layer to create the notification
            const notifications = await this._notificationService.getNotifications(accessToken);

            // Send a success response with the created notification
            sendSuccessResponse(
                response,
                StatusCodes.OK,
                SuccessMessages.OPERATION_SUCCESS,
                { notifications }
            );
        } catch (error) {
            // Handle known application errors by sending appropriate HTTP response
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                // Catch any unexpected errors and return a generic server error response
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async updateArchieveStatus(request: Request, response: Response): Promise<void> {
        try {
            // Extract the access token from cookies
            const { accessToken } = request.cookies;

            // If no access token is found, throw an authentication error
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Extract the notification ID from the request parameters
            const { notificationId } = request.params;

            // Delegate the archiving operation to the service layer
            const isUpdated = await this._notificationService.updateArchieveStatus(accessToken, notificationId);

            // Send a success response indicating whether the archive operation was successful
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { isUpdated });
        } catch (error) {
            // Handle known application errors by sending appropriate HTTP response
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                // Catch any unexpected errors and return a generic server error response
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async updateReadStatus(request: Request, response: Response): Promise<void> {
        try {
            // Extract the access token from cookies
            const { accessToken } = request.cookies;

            // If no access token is found, throw an authentication error
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Extract the notification ID from the request parameters
            const { notificationId } = request.params;

            // Delegate the 'mark as read' operation to the service layer
            const isUpdated = await this._notificationService.updateReadStatus(accessToken, notificationId);

            // Send a success response indicating whether the update was successful
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { isUpdated });
        } catch (error) {
            // Handle known application errors by sending appropriate HTTP response
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                // Catch any unexpected errors and return a generic server error response
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async updateReadStatusAll(request: Request, response: Response): Promise<void> {
        try {
            console.log(`Request comes here`);
            // Extract the access token from cookies
            const { accessToken } = request.cookies;

            // If no access token is found, throw an authentication error
            if (!accessToken) {
                throw new AuthenticationError(
                    ErrorMessages.ACCESS_TOKEN_NOT_FOUND,
                    StatusCodes.UNAUTHORIZED
                );
            }

            // Delegate the 'mark all as read' operation to the service layer
            const isUpdated = await this._notificationService.updateReadStatusAll(accessToken);

            // Send a success response indicating whether the update was successful
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { isUpdated });
        } catch (error) {
            // Handle known application errors by sending appropriate HTTP response
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                // Catch any unexpected errors and return a generic server error response
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default NotificationController;