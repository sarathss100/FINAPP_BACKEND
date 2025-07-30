import INotificatonRepository from './interfaces/INotificaitionRepository'; 
import { NotificationModel } from '../../model/notification/model/NotificaionModel';
import INotificationDocument from '../../model/notification/interfaces/INotificaiton';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import BaseRepository from '../base_repo/BaseRepository';

export default class NotificationRepository implements INotificatonRepository {
    private static _instance: NotificationRepository;
    private baseRepo: IBaseRepository<INotificationDocument> = new BaseRepository<INotificationDocument>(NotificationModel);
    public constructor() {};

    public static get instance(): NotificationRepository {
        if (!NotificationRepository._instance) {
            NotificationRepository._instance = new NotificationRepository();
        }

        return NotificationRepository._instance;
    }

    async createNotification(notificationData: Partial<INotificationDocument>): Promise<INotificationDocument> {
        try {
            // Save the notification to the database using the NotificationModel
            const notificaiton = await this.baseRepo.create(notificationData);

            return notificaiton;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getNotifications(userId: string): Promise<INotificationDocument[]> {
        try {
            // Fetch all notifications associated with the provided user ID
            const notifications = await NotificationModel.find({ user_id: userId, archived: false }).sort({ createdAt: -1 });

            return notifications;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateArchieveStatus(notificationId: string): Promise<boolean> {
        try {
            // Find the notification by ID and update its `archived` field to true
            const response = await this.baseRepo.updateOne({ _id: notificationId },{ $set: { archived: true } });

            return !!response;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateReadStatus(notificationId: string): Promise<boolean> {
        try {
            // Find the notification by ID and update its `is_read` field to true
            const response = await this.baseRepo.updateOne({ _id: notificationId }, { $set: { is_read: true } });

            return !!response;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateReadStatusAll(userId: string): Promise<boolean> {
        try {
            const user_id = userId.toString();

            // Update all notifications for the given user ID
            const result = await NotificationModel.updateMany(
                { user_id }, 
                { $set: { is_read: true } }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
