import { decodeAndValidateToken } from '../../utils/auth/tokenUtils'; 
import { AuthenticationError } from '../../error/AppError'; 
import { ErrorMessages } from '../../constants/errorMessages'; 
import { StatusCodes } from '../../constants/statusCodes'; 
import INotificationService from './interfaces/INotificationService';
import INotificatonManagementRepository from '../../repositories/notifications/interfaces/INotificaitionRepository'; 
import { INotificationDTO } from '../../dtos/notification/NotificationDto'; 
import NotificationManagementRepository from '../../repositories/notifications/NotificaitonRepository'; 
import DebtService from '../../services/debt/DebtService';
import GoalService from '../../services/goal/GoalService';
import { NOTIFICATION_TYPES } from '../../model/notification/interfaces/INotificaiton';
import InsuranceService from '../../services/insurances/InsuranceService';
import { io } from '../../sockets/socket.server';
import { eventBus } from '../../events/eventBus';

class NotificationService implements INotificationService {
    // Singleton instance of the service
    private static _instance: NotificationService;

    private _notificationRepository: INotificatonManagementRepository;

    constructor(notificationRepository: INotificatonManagementRepository) {
        this._notificationRepository = notificationRepository;
    }

    public static get instance(): NotificationService {
        if (!NotificationService._instance) {
            const repo = NotificationManagementRepository.instance;
            NotificationService._instance = new NotificationService(repo);
        }
        return NotificationService._instance;
    }

    // Creates a new notification after authenticating the user.
    async createNotification(
        accessToken: string,
        notificationData: INotificationDTO
    ): Promise<INotificationDTO> {
        try {
            let userId;
            if (accessToken) {
                // Decode and validate the access token to extract the user ID
                userId = decodeAndValidateToken(accessToken);

                // Ensure the token contains a valid user ID
                if (!userId) {
                    throw new AuthenticationError(
                        ErrorMessages.USER_ID_MISSING_IN_TOKEN,
                        StatusCodes.BAD_REQUEST
                    );
                }

                // Attach the authenticated user's ID to the notification data
                notificationData.user_id = userId;
            }

            // Delegate creation to the repository layer
            const createdNotification = await this._notificationRepository.createNotification(notificationData);

            // Emit socket event to notify user about new notification
            eventBus.emit('notification_created', createdNotification);

            // Return the created notification to the caller
            return createdNotification;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error creating notification:', error);

            // Re-throw the error in a standardized format
            throw new Error((error as Error).message);
        }
    }

    // Retrieves all notifications for the authenticated user.
    async getNotifications(accessToken: string): Promise<INotificationDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);

            // Ensure the token contains a valid user ID
            if (!userId) {
                throw new AuthenticationError(
                    ErrorMessages.USER_ID_MISSING_IN_TOKEN,
                    StatusCodes.BAD_REQUEST
                );
            }

            // Delegate the fetching of notifications to the repository layer
            const notifications = await this._notificationRepository.getNotifications(userId);

            // Return the list of notifications to the caller
            return notifications;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error fetching notifications:', error);

            // Re-throw the error in a standardized format
            throw new Error((error as Error).message);
        }
    }

    // Archives all notifications belonging to the authenticated user.
    async updateArchieveStatus(accessToken: string, notificationId: string): Promise<boolean> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);

            // Ensure the token contains a valid user ID
            if (!userId) {
                throw new AuthenticationError(
                    ErrorMessages.USER_ID_MISSING_IN_TOKEN,
                    StatusCodes.BAD_REQUEST
                );
            }

            // Delegate the archiving operation to the repository layer
            const isUpdated = await this._notificationRepository.updateArchieveStatus(notificationId);

            // Emit socket event to notify user about new notification
            io.of('/notification').to(`user_${userId}`).emit('notification_archieved', notificationId);

            // Return the result indicating whether the update was successful
            return isUpdated;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error archiving notifications:', error);

            // Re-throw the error in a standardized format
            throw new Error((error as Error).message);
        }
    }

    // Marks a specific notification as read based on its ID.
    async updateReadStatus(accessToken: string, notificationId: string): Promise<boolean> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);

            // Ensure the token contains a valid user ID
            if (!userId) {
                throw new AuthenticationError(
                    ErrorMessages.USER_ID_MISSING_IN_TOKEN,
                    StatusCodes.BAD_REQUEST
                );
            }

            // Delegate the 'mark as read' operation to the repository layer
            const isUpdated = await this._notificationRepository.updateReadStatus(notificationId);
            

            // Return the result indicating whether the update was successful
            return isUpdated;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error marking notification as read:', error);

            // Re-throw the error in a standardized format
            throw new Error((error as Error).message);
        }
    }

    // Marks all notifications for the authenticated user as read.
    async updateReadStatusAll(accessToken: string): Promise<boolean> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);

            // Ensure the token contains a valid user ID
            if (!userId) {
                throw new AuthenticationError(
                    ErrorMessages.USER_ID_MISSING_IN_TOKEN,
                    StatusCodes.BAD_REQUEST
                );
            }

            // Delegate the 'mark all as read' operation to the repository layer
            const isUpdated = await this._notificationRepository.updateReadStatusAll(userId);

            // Return result indicating success or failure
            return isUpdated;
        } catch (error) {
            // Log error for debugging
            console.error('Error marking notifications as read:', error);

            // Re-throw error preserving the original message
            throw new Error((error as Error).message);
        }
    }

    // Checks for upcoming debt payments and creates notifications for users.
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
            // Log the error for debugging purposes
            console.error('Error checking upcoming debt payments and creating notifications:', error);

            // Re-throw the error in a standardized format
            throw new Error((error as Error).message);
        }
    }

    /**
     * Checks for monthly goal payment reminders and creates notifications for users.
     *
     * This method retrieves goals that require monthly payments, calculates a due date
     * (2 days from today), and generates a notification for each associated user
     * to remind them about the upcoming payment.
     *
     * @returns {Promise<void>} A promise that resolves when all notifications have been processed.
     * @throws {Error} If an error occurs during goal retrieval or notification creation.
     */
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
                    type: NOTIFICATION_TYPES[1], // GoalPaymentAlert
                    is_read: false,
                    meta: { 
                        goalId: goal._id, 
                        dueDate: dueDate.toISOString() // Store due date in standardized format
                    },
                    archived: false,
                });
            }
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error checking monthly goal payments and creating notifications:', error);

            // Re-throw the error with a descriptive message
            throw new Error((error as Error).message);
        }
    }

    /**
     * Checks for upcoming insurance payments and sends payment reminders to users.
     *
     * This method retrieves insurance policies with approaching payment dates
     * and generates a notification for each associated user to remind them
     * about the upcoming payment.
     *
     * @returns {Promise<void>} A promise that resolves when all notifications have been processed.
     * @throws {Error} If an error occurs during insurance retrieval or notification creation.
     */
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
            // Log the error for debugging purposes
            console.error('Error checking monthly goal payments and creating notifications:', error);

            // Re-throw the error with a descriptive message
            throw new Error((error as Error).message);
        }
    }

    /**
     * Runs all scheduled notification checks to alert users about upcoming items.
     *
     * This method triggers checks for various types of scheduled notifications,
     * such as upcoming debt payments, goal reminders, insurance due dates, etc.
     * It serves as a central orchestrator for time-based notification logic.
     *
     * @returns {Promise<void>} A promise that resolves when all scheduled notification checks are complete.
     * @throws {Error} If any error occurs during the execution of notification checks.
     */
    async runScheduledNotifications(): Promise<void> {
        try {
            await this.checkAndNotifyUpcomingDebtPayments();
            await this.checkAndNotifyInsurancePayments();
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error during scheduled notification checks:', error);

            // Re-throw the error in a standardized format
            throw new Error((error as Error).message);
        }
    }
}

export default NotificationService;