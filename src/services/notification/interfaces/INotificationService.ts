import { INotificationDTO } from 'dtos/notification/NotificationDto';

interface INotificationService {
    createNotification(accessToken: string, notificationData: INotificationDTO): Promise<INotificationDTO>;
}

export default INotificationService;
