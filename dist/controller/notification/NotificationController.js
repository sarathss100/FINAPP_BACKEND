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
const responseHandler_1 = require("utils/responseHandler");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const AppError_1 = require("error/AppError");
const successMessages_1 = require("constants/successMessages");
const notification_validation_1 = __importDefault(require("validation/notification/notification.validation"));
/**
 * Controller class responsible for handling incoming HTTP requests related to notifications.
 * This class acts as an intermediary between the routes and the service layer,
 * ensuring proper validation, error handling, and response formatting.
 */
class NotificationController {
    /**
     * Initializes a new instance of the NotificationController.
     *
     * @param notificaitonService - Service instance to handle business logic.
     */
    constructor(notificaitonService) {
        this._notificationService = notificaitonService;
    }
    /**
     * Handles the creation of a new notification via an HTTP POST request.
     * Validates the access token and request body before delegating to the service layer.
     *
     * @param request - Express request object containing cookies and notification data.
     * @param response - Express response object used to send back the result.
     */
    createNotification(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the access token from cookies
                const { accessToken } = request.cookies;
                // If no access token is found, throw an authentication error
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Validate the incoming request body using the Zod schema
                const parsedBody = notification_validation_1.default.safeParse(request.body);
                // If validation fails, extract and log the validation errors
                if (!parsedBody.success) {
                    const errors = parsedBody.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }));
                    console.error(errors);
                    // Throw a validation error to be caught and handled below
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Extract the validated notification data from the parsed body
                const notificationData = parsedBody.data;
                // Use the service layer to create the notification
                const createdNotification = yield this._notificationService.createNotification(accessToken, notificationData);
                // Send a success response with the created notification
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { createdNotification });
            }
            catch (error) {
                // Handle known application errors by sending appropriate HTTP response
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    // Catch any unexpected errors and return a generic server error response
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Handles the creation of a new notification via an HTTP POST request.
     * Validates the access token and request body before delegating to the service layer.
     *
     * @param request - Express request object containing cookies and notification data.
     * @param response - Express response object used to send back the result.
     */
    getNotifications(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the access token from cookies
                const { accessToken } = request.cookies;
                // If no access token is found, throw an authentication error
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Use the service layer to create the notification
                const notifications = yield this._notificationService.getNotifications(accessToken);
                // Send a success response with the created notification
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { notifications });
            }
            catch (error) {
                // Handle known application errors by sending appropriate HTTP response
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    // Catch any unexpected errors and return a generic server error response
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Handles the request to archive a specific notification.
     * Extracts the notification ID from the request and delegates the operation to the service layer.
     *
     * @param request - Express request object containing route parameters (notification ID).
     * @param response - Express response object used to send back the result.
     */
    updateArchieveStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the access token from cookies
                const { accessToken } = request.cookies;
                // If no access token is found, throw an authentication error
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Extract the notification ID from the request parameters
                const { notificationId } = request.params;
                // Delegate the archiving operation to the service layer
                const isUpdated = yield this._notificationService.updateArchieveStatus(accessToken, notificationId);
                // Send a success response indicating whether the archive operation was successful
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { isUpdated });
            }
            catch (error) {
                // Handle known application errors by sending appropriate HTTP response
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    // Catch any unexpected errors and return a generic server error response
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Handles the request to mark a specific notification as read.
     * Extracts the notification ID from the request and delegates the operation to the service layer.
     *
     * @param request - Express request object containing route parameters (notification ID).
     * @param response - Express response object used to send back the result.
     */
    updateReadStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the access token from cookies
                const { accessToken } = request.cookies;
                // If no access token is found, throw an authentication error
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Extract the notification ID from the request parameters
                const { notificationId } = request.params;
                // Delegate the 'mark as read' operation to the service layer
                const isUpdated = yield this._notificationService.updateReadStatus(accessToken, notificationId);
                // Send a success response indicating whether the update was successful
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { isUpdated });
            }
            catch (error) {
                // Handle known application errors by sending appropriate HTTP response
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    // Catch any unexpected errors and return a generic server error response
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Handles the request to mark all notifications as read for the authenticated user.
     * Extracts the access token from cookies to identify the user,
     * and delegates the operation to the service layer.
     *
     * @param request - Express request object containing cookies (access token).
     * @param response - Express response object used to send back the result.
     */
    updateReadStatusAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Request comes here`);
                // Extract the access token from cookies
                const { accessToken } = request.cookies;
                // If no access token is found, throw an authentication error
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Delegate the 'mark all as read' operation to the service layer
                const isUpdated = yield this._notificationService.updateReadStatusAll(accessToken);
                // Send a success response indicating whether the update was successful
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { isUpdated });
            }
            catch (error) {
                // Handle known application errors by sending appropriate HTTP response
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    // Catch any unexpected errors and return a generic server error response
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = NotificationController;
