import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { Request, Response } from 'express';
import { AppError, AuthenticationError, ValidationError } from 'error/AppError';
import { SuccessMessages } from 'constants/successMessages';
import INotificationController from './interfaces/INotificationController';
import INotificationService from 'services/notification/interfaces/INotificationService';
import notificationDTOSchema from 'validation/notification/notification.validation';

class NotificationController implements INotificationController {
    private readonly _notificationService: INotificationService;

    constructor(notificaitonService: INotificationService) {
        this._notificationService = notificaitonService;
    }
    
    async createNotification(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Validate the request body using the Zod schema
            const parsedBody = notificationDTOSchema.safeParse(request.body);

            if (!parsedBody.success) {
                // If validation fails, extract the error details
                const errors = parsedBody.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                console.error(errors);

                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }

            // Extract the validated data
            const notificationData = parsedBody.data;
            
            // Call the service layer to create the goal
            const createdGoal = await this._notificationService.createNotification(accessToken, notificationData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOAL_CREATED, { createdGoal } );
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default NotificationController;
