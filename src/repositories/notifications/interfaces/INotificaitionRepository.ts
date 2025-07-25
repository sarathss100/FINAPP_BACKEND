import { INotificationDTO } from '../../../dtos/notification/NotificationDto';

interface INotificatonManagementRepository {
    createNotification(notificationData: INotificationDTO): Promise<INotificationDTO>;
    getNotifications(userId: string): Promise<INotificationDTO[]>;
    updateArchieveStatus(notificationId: string): Promise<boolean>;
    updateReadStatus(notificationId: string): Promise<boolean>;
    updateReadStatusAll(userId: string): Promise<boolean>;
}

export default INotificatonManagementRepository;
