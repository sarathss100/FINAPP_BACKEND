import { INotificationDTO } from 'dtos/notification/NotificationDto';

interface INotificationService {
    createNotification(accessToken: string, notificationData: INotificationDTO): Promise<INotificationDTO>;
    getNotifications(accessToken: string): Promise<INotificationDTO[]>;
    updateArchieveStatus(accessToken: string, notificationId: string): Promise<boolean>;
    updateReadStatus(accessToken: string, notificationId: string): Promise<boolean>;
    updateReadStatusAll(accessToken: string): Promise<boolean>;
    checkAndNotifyUpcomingDebtPayments(): Promise<void>;
    checkAndNotifyMonthlyGoalPayments(): Promise<void>;
    checkAndNotifyInsurancePayments(): Promise<void>;
    runScheduledNotifications(): Promise<void>;
}

export default INotificationService;
