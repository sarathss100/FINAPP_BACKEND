import { INotificationDTO } from 'dtos/notification/NotificationDto';
import INotificatonManagementRepository from './interfaces/INotificaitionRepository';
import { NotificationModel } from 'model/notification/model/NotificaionModel';

class NotificationManagementRepository implements INotificatonManagementRepository {
    async createNotification(notificationData: INotificationDTO): Promise<INotificationDTO> {
        try {
            const response = await NotificationModel.create({ notificationData });
            const createdNotification: INotificationDTO = {
                user_id: response.user_id.toString(),
                message: response.message,
                isSeen: response.isSeen,
                is_completed: response.is_completed,
                reminder_frequency: response.reminder_frequency.toString(),
                next_reminder_date: response.next_reminder_date.toString(),
                priority_level: response.priority_level,
                target_Date: response.target_Date.toString(),
                createdAt: response.createdAt?.toString(),
                updatedAt: response.updatedAt?.toString(),
            };
            return createdNotification;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export default NotificationManagementRepository;
