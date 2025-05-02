import { INotificationDTO } from 'dtos/notification/NotificationDto';

interface INotificatonManagementRepository {
    createNotification(notificationData: INotificationDTO): Promise<INotificationDTO>;
}

export default INotificatonManagementRepository;
