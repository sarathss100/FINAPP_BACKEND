import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import INotificationService from './interfaces/INotificationService';
import INotificatonManagementRepository from 'repositories/notifications/interfaces/INotificaitionRepository';
import { INotificationDTO } from 'dtos/notification/NotificationDto';

/**
 * Service class for managing goals, including creating, updating, deleting, and retrieving goals.
 * This class interacts with the goal repository to perform database operations.
 */
class NotificationService implements INotificationService {
    private _notificationRepository: INotificatonManagementRepository;


    constructor(notificationRepository: INotificatonManagementRepository) {
        this._notificationRepository = notificationRepository;
    }

    
    async createNotification(accessToken: string, notificationData: INotificationDTO): Promise<INotificationDTO> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to create the goal using the extracted user ID and provided goal data.
            const createdNotification = await this._notificationRepository.createNotification(notificationData);

            return createdNotification;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error creating goal:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default NotificationService;
