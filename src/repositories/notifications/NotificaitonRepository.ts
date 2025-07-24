import { INotificationDTO } from 'dtos/notification/NotificationDto';
import INotificatonManagementRepository from './interfaces/INotificaitionRepository'; 
import { NotificationModel } from 'model/notification/model/NotificaionModel';

class NotificationManagementRepository implements INotificatonManagementRepository {
    private static _instance: NotificationManagementRepository;
    public constructor() {};

    public static get instance(): NotificationManagementRepository {
        if (!NotificationManagementRepository._instance) {
            NotificationManagementRepository._instance = new NotificationManagementRepository();
        }

        return NotificationManagementRepository._instance;
    }

    // Creates a new notification in the data store.
    async createNotification(notificationData: INotificationDTO): Promise<INotificationDTO> {
        try {
            // Save the notification to the database using the NotificationModel
            const response = await NotificationModel.create(notificationData);

            // Map the saved document back into a DTO format to return
            const createdNotification: INotificationDTO = {
                _id: response._id?.toString(),
                user_id: response.user_id,
                title: response.title,
                message: response.message,
                type: response.type,
                is_read: response.is_read,
                meta: response.meta,
                archived: response.archived,
                createdAt: response.createdAt,
            };

            // Return the newly created notification as a DTO
            return createdNotification;
        } catch (error) {
            // Catch any errors during the operation and throw a standard Error object
            throw new Error((error as Error).message);
        }
    }

    // Retrieves all notifications for a specific user from the data store.
    async getNotifications(userId: string): Promise<INotificationDTO[]> {
        try {
            // Fetch all notifications associated with the provided user ID
            const response = await NotificationModel.find({ user_id: userId, archived: false }).sort({ createdAt: -1 });

            // Map the database documents to the notification DTO format
            const notifications = response.map((data) => ({
                _id: data._id?.toString(),
                user_id: data.user_id,
                title: data.title,
                message: data.message,
                type: data.type,
                is_read: data.is_read,
                meta: data.meta,
                archived: data.archived,
                createdAt: data.createdAt,
            }));

            // Return the list of notifications
            return notifications;
        } catch (error) {
            // Catch and throw any errors that occur during the retrieval process
            throw new Error((error as Error).message);
        }
    }

    // Archives a notification by setting its `archived` flag to true.
    async updateArchieveStatus(notificationId: string): Promise<boolean> {
        try {
            // Find the notification by ID and update its `archived` field to true
            const response = await NotificationModel.findByIdAndUpdate(
                notificationId,
                { $set: { archived: true } }
            );

            // Return true if a document was found and updated, false otherwise
            return !!response;
        } catch (error) {
            // Catch any errors during the update process and re-throw with descriptive message
            throw new Error((error as Error).message);
        }
    }

    // Marks a notification as read by setting its `is_read` flag to true.
    async updateReadStatus(notificationId: string): Promise<boolean> {
        try {
            // Find the notification by ID and update its `is_read` field to true
            const response = await NotificationModel.findByIdAndUpdate(
                notificationId,
                { $set: { is_read: true } }
            );

            // Return true if a document was found and updated, false otherwise
            return !!response;
        } catch (error) {
            // Catch any errors during the update process and re-throw with a descriptive message
            throw new Error((error as Error).message);
        }
    }

    // Marks all notifications for a specific user as read by setting their `is_read` flag to true.
    async updateReadStatusAll(userId: string): Promise<boolean> {
        try {
            const user_id = userId.toString();

            // Update all notifications for the given user ID
            const result = await NotificationModel.updateMany(
                { user_id }, 
                { $set: { is_read: true } }
            );

            // Return true if at least one document was modified
            return result.modifiedCount > 0;
        } catch (error) {
            // Throw a new error with the original message
            throw new Error((error as Error).message);
        }
    }
}

export default NotificationManagementRepository;