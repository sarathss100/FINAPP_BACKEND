"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenUtils_1 = require("utils/auth/tokenUtils");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const NotificaitonRepository_1 = __importDefault(require("repositories/notifications/NotificaitonRepository"));
const DebtService_1 = __importDefault(require("services/debt/DebtService"));
const GoalService_1 = __importDefault(require("services/goal/GoalService"));
const INotificaiton_1 = require("model/notification/interfaces/INotificaiton");
const InsuranceService_1 = __importDefault(require("services/insurances/InsuranceService"));
const socket_server_1 = require("sockets/socket.server");
const eventBus_1 = require("events/eventBus");
class NotificationService {
    constructor(notificationRepository) {
        this._notificationRepository = notificationRepository;
    }
    static get instance() {
        if (!NotificationService._instance) {
            const repo = NotificaitonRepository_1.default.instance;
            NotificationService._instance = new NotificationService(repo);
        }
        return NotificationService._instance;
    }
    // Creates a new notification after authenticating the user.
    createNotification(accessToken, notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId;
                if (accessToken) {
                    // Decode and validate the access token to extract the user ID
                    userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                    // Ensure the token contains a valid user ID
                    if (!userId) {
                        throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                    }
                    // Attach the authenticated user's ID to the notification data
                    notificationData.user_id = userId;
                }
                // Delegate creation to the repository layer
                const createdNotification = yield this._notificationRepository.createNotification(notificationData);
                // Emit socket event to notify user about new notification
                eventBus_1.eventBus.emit('notification_created', createdNotification);
                // Return the created notification to the caller
                return createdNotification;
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error creating notification:', error);
                // Re-throw the error in a standardized format
                throw new Error(error.message);
            }
        });
    }
    // Retrieves all notifications for the authenticated user.
    getNotifications(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                // Ensure the token contains a valid user ID
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate the fetching of notifications to the repository layer
                const notifications = yield this._notificationRepository.getNotifications(userId);
                // Return the list of notifications to the caller
                return notifications;
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error fetching notifications:', error);
                // Re-throw the error in a standardized format
                throw new Error(error.message);
            }
        });
    }
    // Archives all notifications belonging to the authenticated user.
    updateArchieveStatus(accessToken, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                // Ensure the token contains a valid user ID
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate the archiving operation to the repository layer
                const isUpdated = yield this._notificationRepository.updateArchieveStatus(notificationId);
                // Emit socket event to notify user about new notification
                socket_server_1.io.of('/notification').to(`user_${userId}`).emit('notification_archieved', notificationId);
                // Return the result indicating whether the update was successful
                return isUpdated;
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error archiving notifications:', error);
                // Re-throw the error in a standardized format
                throw new Error(error.message);
            }
        });
    }
    // Marks a specific notification as read based on its ID.
    updateReadStatus(accessToken, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                // Ensure the token contains a valid user ID
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate the 'mark as read' operation to the repository layer
                const isUpdated = yield this._notificationRepository.updateReadStatus(notificationId);
                // Return the result indicating whether the update was successful
                return isUpdated;
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error marking notification as read:', error);
                // Re-throw the error in a standardized format
                throw new Error(error.message);
            }
        });
    }
    // Marks all notifications for the authenticated user as read.
    updateReadStatusAll(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                // Ensure the token contains a valid user ID
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate the 'mark all as read' operation to the repository layer
                const isUpdated = yield this._notificationRepository.updateReadStatusAll(userId);
                // Return result indicating success or failure
                return isUpdated;
            }
            catch (error) {
                // Log error for debugging
                console.error('Error marking notifications as read:', error);
                // Re-throw error preserving the original message
                throw new Error(error.message);
            }
        });
    }
    // Checks for upcoming debt payments and creates notifications for users.
    checkAndNotifyUpcomingDebtPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const debtService = DebtService_1.default.instance;
                const debts = yield debtService.getDebtsForNotifyUpcomingDebtPayments();
                for (const debt of debts) {
                    yield this._notificationRepository.createNotification({
                        user_id: debt.userId,
                        title: 'Debt Payment Due Soon',
                        message: `Your debt payment for ${debt.debtName} is due in 2 days.`,
                        type: 'DebtPaymentAlert',
                        is_read: false,
                        meta: { debtId: debt._id, dueDate: debt.nextDueDate },
                        archived: false,
                    });
                }
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error checking upcoming debt payments and creating notifications:', error);
                // Re-throw the error in a standardized format
                throw new Error(error.message);
            }
        });
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
    checkAndNotifyMonthlyGoalPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const goalService = GoalService_1.default.instance;
                const goals = yield goalService.getGoalsForNotifyMonthlyGoalPayments();
                // Calculate due date: current date + 2 days
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 2);
                for (const goal of goals) {
                    yield this._notificationRepository.createNotification({
                        user_id: (_a = goal.user_id) === null || _a === void 0 ? void 0 : _a.toString(),
                        title: 'Time to pay Your Goal',
                        message: `It's time to make your monthly payment for ${goal.goal_name}`,
                        type: INotificaiton_1.NOTIFICATION_TYPES[1], // GoalPaymentAlert
                        is_read: false,
                        meta: {
                            goalId: goal._id,
                            dueDate: dueDate.toISOString() // Store due date in standardized format
                        },
                        archived: false,
                    });
                }
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error checking monthly goal payments and creating notifications:', error);
                // Re-throw the error with a descriptive message
                throw new Error(error.message);
            }
        });
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
    checkAndNotifyInsurancePayments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insuranceService = InsuranceService_1.default.instance;
                const insurances = yield insuranceService.getInsuranceForNotifyInsurancePayments();
                for (const insurance of insurances) {
                    yield this._notificationRepository.createNotification({
                        user_id: insurance.userId,
                        title: 'Upcoming Insurance Payment',
                        message: `Your insurance payment for ${insurance.type} is due soon.`,
                        type: INotificaiton_1.NOTIFICATION_TYPES[2],
                        is_read: false,
                        meta: {
                            insuranceId: insurance._id,
                            dueDate: insurance.next_payment_date.toISOString(),
                        },
                        archived: false,
                    });
                }
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error checking monthly goal payments and creating notifications:', error);
                // Re-throw the error with a descriptive message
                throw new Error(error.message);
            }
        });
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
    runScheduledNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkAndNotifyUpcomingDebtPayments();
                yield this.checkAndNotifyInsurancePayments();
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error during scheduled notification checks:', error);
                // Re-throw the error in a standardized format
                throw new Error(error.message);
            }
        });
    }
}
exports.default = NotificationService;
