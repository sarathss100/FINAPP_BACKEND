import INotificationService from './interfaces/INotificationService';
import INotificatonRepository from '../../repositories/notifications/interfaces/INotificaitionRepository'; 
import INotificationDTO from '../../dtos/notification/NotificationDTO'; 
import NotificationRepository from '../../repositories/notifications/NotificaitonRepository'; 
import DebtService from '../../services/debt/DebtService';
import GoalService from '../../services/goal/GoalService';
import { NOTIFICATION_TYPES } from '../../model/notification/interfaces/INotificaiton';
import InsuranceService from '../../services/insurances/InsuranceService';
import { io } from '../../sockets/socket.server';
import { eventBus } from '../../events/eventBus';
import { extractUserIdFromToken, wrapServiceError } from '../../utils/serviceUtils';
import NotificationMapper from '../../mappers/notifications/NotificationMapper';

export default class NotificationService implements INotificationService {
    private static _instance: NotificationService;
    private _notificationRepository: INotificatonRepository;

    constructor(notificationRepository: INotificatonRepository) {
        this._notificationRepository = notificationRepository;
    }

    public static get instance(): NotificationService {
        if (!NotificationService._instance) {
            const repo = NotificationRepository.instance;
            NotificationService._instance = new NotificationService(repo);
        }
        return NotificationService._instance;
    }

    async createNotification(accessToken: string, notificationData: INotificationDTO): Promise<INotificationDTO> {
        try {
            let userId;
            if (accessToken) {
                userId = extractUserIdFromToken(accessToken);

                // Attach the authenticated user's ID to the notification data
                notificationData.user_id = userId;
            }

            const mappedModel = NotificationMapper.toModel(notificationData);

            // Delegate creation to the repository layer
            const createdNotification = await this._notificationRepository.createNotification(mappedModel);

            const resultDTO = NotificationMapper.toDTO(createdNotification);

            // Emit socket event to notify user about new notification
            eventBus.emit('notification_created', resultDTO);

            return resultDTO;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw wrapServiceError(error);
        }
    }

    async getNotifications(accessToken: string): Promise<INotificationDTO[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Delegate the fetching of notifications to the repository layer
            const notifications = await this._notificationRepository.getNotifications(userId);

            const resultDTO = NotificationMapper.toDTOs(notifications);

            return resultDTO;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw wrapServiceError(error);
        }
    }

    async updateArchieveStatus(accessToken: string, notificationId: string): Promise<boolean> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Delegate the archiving operation to the repository layer
            const isUpdated = await this._notificationRepository.updateArchieveStatus(notificationId);

            // Emit socket event to notify user about new notification
            io.of('/notification').to(`user_${userId}`).emit('notification_archieved', notificationId);

            return isUpdated;
        } catch (error) {
            console.error('Error archiving notifications:', error);
            throw wrapServiceError(error);
        }
    }

    async updateReadStatus(accessToken: string, notificationId: string): Promise<boolean> {
        try {
            // Delegate the 'mark as read' operation to the repository layer
            const isUpdated = await this._notificationRepository.updateReadStatus(notificationId);
            
            return isUpdated;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw wrapServiceError(error);
        }
    }

    async updateReadStatusAll(accessToken: string): Promise<boolean> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Delegate the 'mark all as read' operation to the repository layer
            const isUpdated = await this._notificationRepository.updateReadStatusAll(userId);

            return isUpdated;
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            throw wrapServiceError(error);
        }
    }

    async checkAndNotifyUpcomingDebtPayments(): Promise<void> {
        try {
            const debtService = DebtService.instance;
            const debts = await debtService.getDebtsForNotifyUpcomingDebtPayments();

            for (const debt of debts) {
                await this._notificationRepository.createNotification({ 
                    user_id: debt.userId,
                    title: 'Debt Payment Due Soon',
                    message: `Your debt payment for ${debt.debtName} is due in 2 days.`,
                    type: 'DebtPaymentAlert',
                    is_read: false,
                    meta: { debtId: debt._id, dueDate: debt.nextDueDate },
                    archived: false,
                });
            }
        } catch (error) {
            console.error('Error checking upcoming debt payments and creating notifications:', error);
            throw wrapServiceError(error);
        }
    }

    async checkAndNotifyMonthlyGoalPayments(): Promise<void> {
        try {
            const goalService = GoalService.instance;
            const goals = await goalService.getGoalsForNotifyMonthlyGoalPayments();

            // Calculate due date: current date + 2 days
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 2);

            for (const goal of goals) {
                await this._notificationRepository.createNotification({ 
                    user_id: goal.user_id?.toString(),
                    title: 'Time to pay Your Goal',
                    message: `It's time to make your monthly payment for ${goal.goal_name}`,
                    type: NOTIFICATION_TYPES[1],
                    is_read: false,
                    meta: { 
                        goalId: goal._id, 
                        dueDate: dueDate.toISOString()
                    },
                    archived: false,
                });
            }
        } catch (error) {
            console.error('Error checking monthly goal payments and creating notifications:', error);
            throw wrapServiceError(error);
        }
    }

    async checkAndNotifyInsurancePayments(): Promise<void> {
        try {
            const insuranceService = InsuranceService.instance;
            const insurances = await insuranceService.getInsuranceForNotifyInsurancePayments();

            for (const insurance of insurances) {
                await this._notificationRepository.createNotification({ 
                    user_id: insurance.userId,
                    title: 'Upcoming Insurance Payment',
                    message: `Your insurance payment for ${insurance.type} is due soon.`,
                    type: NOTIFICATION_TYPES[2],
                    is_read: false,
                    meta: { 
                        insuranceId: insurance._id, 
                        dueDate: insurance.next_payment_date.toISOString(),
                    },
                    archived: false,
                });
            }
        } catch (error) {
            console.error('Error checking monthly goal payments and creating notifications:', error);
            throw wrapServiceError(error);
        }
    }

    async runScheduledNotifications(): Promise<void> {
        try {
            await this.checkAndNotifyUpcomingDebtPayments();
            await this.checkAndNotifyInsurancePayments();
        } catch (error) {
            console.error('Error during scheduled notification checks:', error);
            throw wrapServiceError(error);
        }
    }
}