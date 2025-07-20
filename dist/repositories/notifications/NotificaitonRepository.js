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
Object.defineProperty(exports, "__esModule", { value: true });
const NotificaionModel_1 = require("model/notification/model/NotificaionModel");
/**
 * Implementation of the notification management repository.
 * This class provides methods to interact with the notification data layer (e.g., database).
 */
class NotificationManagementRepository {
    constructor() { }
    ;
    static get instance() {
        if (!NotificationManagementRepository._instance) {
            NotificationManagementRepository._instance = new NotificationManagementRepository();
        }
        return NotificationManagementRepository._instance;
    }
    /**
     * Creates a new notification in the data store.
     *
     * @param notificationData - The notification data transfer object containing required fields.
     * @returns A promise that resolves to the created notification DTO.
     * @throws Error if the notification creation fails.
     */
    createNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Save the notification to the database using the NotificationModel
                const response = yield NotificaionModel_1.NotificationModel.create(notificationData);
                // Map the saved document back into a DTO format to return
                const createdNotification = {
                    _id: (_a = response._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    user_id: response.user_id,
                    title: response.title,
                    message: response.message,
                    type: response.type,
                    is_read: response.is_read,
                    meta: response.meta,
                    archived: response.archived,
                    createdAt: response.createdAt,
                };
                // Return the newly created notification as a DTO
                return createdNotification;
            }
            catch (error) {
                // Catch any errors during the operation and throw a standard Error object
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves all notifications for a specific user from the data store.
     *
     * @param userId - The ID of the user whose notifications are to be fetched.
     * @returns A promise that resolves to an array of notification DTOs.
     * @throws Error if the retrieval process fails.
     */
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all notifications associated with the provided user ID
                const response = yield NotificaionModel_1.NotificationModel.find({ user_id: userId, archived: false }).sort({ createdAt: -1 });
                // Map the database documents to the notification DTO format
                const notifications = response.map((data) => {
                    var _a;
                    return ({
                        _id: (_a = data._id) === null || _a === void 0 ? void 0 : _a.toString(),
                        user_id: data.user_id,
                        title: data.title,
                        message: data.message,
                        type: data.type,
                        is_read: data.is_read,
                        meta: data.meta,
                        archived: data.archived,
                        createdAt: data.createdAt,
                    });
                });
                // Return the list of notifications
                return notifications;
            }
            catch (error) {
                // Catch and throw any errors that occur during the retrieval process
                throw new Error(error.message);
            }
        });
    }
    /**
     * Archives a notification by setting its `archived` flag to true.
     *
     * @param notificationId - The ID of the notification to be archived.
     * @returns A promise that resolves to `true` if the notification was found and updated, otherwise `false`.
     * @throws Error if an exception occurs during the update process.
     */
    updateArchieveStatus(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the notification by ID and update its `archived` field to true
                const response = yield NotificaionModel_1.NotificationModel.findByIdAndUpdate(notificationId, { $set: { archived: true } });
                // Return true if a document was found and updated, false otherwise
                return !!response;
            }
            catch (error) {
                // Catch any errors during the update process and re-throw with descriptive message
                throw new Error(error.message);
            }
        });
    }
    /**
     * Marks a notification as read by setting its `is_read` flag to true.
     *
     * @param notificationId - The ID of the notification to be marked as read.
     * @returns A promise that resolves to `true` if the notification was found and updated, otherwise `false`.
     * @throws Error if an exception occurs during the update process.
     */
    updateReadStatus(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the notification by ID and update its `is_read` field to true
                const response = yield NotificaionModel_1.NotificationModel.findByIdAndUpdate(notificationId, { $set: { is_read: true } });
                // Return true if a document was found and updated, false otherwise
                return !!response;
            }
            catch (error) {
                // Catch any errors during the update process and re-throw with a descriptive message
                throw new Error(error.message);
            }
        });
    }
    /**
     * Marks all notifications for a specific user as read by setting their `is_read` flag to true.
     *
     * @param {string} userId - The ID of the user whose notifications should be marked as read.
     * @returns {Promise<boolean>} Returns `true` if at least one notification was updated, otherwise `false`.
     * @throws {Error} If an error occurs during the update process.
     */
    updateReadStatusAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = userId.toString();
                console.log(`Request comes here`, user_id);
                // Update all notifications for the given user ID
                const result = yield NotificaionModel_1.NotificationModel.updateMany({ user_id }, { $set: { is_read: true } });
                // Return true if at least one document was modified
                return result.modifiedCount > 0;
            }
            catch (error) {
                // Throw a new error with the original message
                throw new Error(error.message);
            }
        });
    }
}
exports.default = NotificationManagementRepository;
