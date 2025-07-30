import INotificationDocument from '../../../model/notification/interfaces/INotificaiton';

export default interface INotificatonRepository {
    createNotification(notificationData: Partial<INotificationDocument>): Promise<INotificationDocument>;
    getNotifications(userId: string): Promise<INotificationDocument[]>;
    updateArchieveStatus(notificationId: string): Promise<boolean>;
    updateReadStatus(notificationId: string): Promise<boolean>;
    updateReadStatusAll(userId: string): Promise<boolean>;
}
