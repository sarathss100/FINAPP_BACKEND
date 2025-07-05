import { INotificationDTO } from 'dtos/notification/NotificationDto';
import INotificatonManagementRepository from './interfaces/INotificaitionRepository'; 
import { NotificationModel } from 'model/notification/model/NotificaionModel';

/**
 * Implementation of the notification management repository.
 * This class provides methods to interact with the notification data layer (e.g., database).
 */
class NotificationManagementRepository implements INotificatonManagementRepository {
    private static _instance: NotificationManagementRepository;
    public constructor() {};

    public static get instance(): NotificationManagementRepository {
        if (!NotificationManagementRepository._instance) {
            NotificationManagementRepository._instance = new NotificationManagementRepository();
        }

        return NotificationManagementRepository._instance;
    }

    /**
     * Creates a new notification in the data store.
     * 
     * @param notificationData - The notification data transfer object containing required fields.
     * @returns A promise that resolves to the created notification DTO.
     * @throws Error if the notification creation fails.
     */
    async createNotification(notificationData: INotificationDTO): Promise<INotificationDTO> {
        try {
            // Save the notification to the database using the NotificationModel
            const response = await NotificationModel.create(notificationData);

            // Map the saved document back into a DTO format to return
            const createdNotification: INotificationDTO = {
                user_id: response.user_id,
                title: response.title,
                message: response.message,
                type: response.type,
                is_read: response.is_read,
                meta: response.meta,
                archived: response.archived,
            };

            // Return the newly created notification as a DTO
            return createdNotification;
        } catch (error) {
            // Catch any errors during the operation and throw a standard Error object
            throw new Error((error as Error).message);
        }
    }
}

export default NotificationManagementRepository;