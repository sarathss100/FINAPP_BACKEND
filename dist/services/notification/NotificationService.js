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
const tokenUtils_1 = require("utils/auth/tokenUtils");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
/**
 * Service class for managing goals, including creating, updating, deleting, and retrieving goals.
 * This class interacts with the goal repository to perform database operations.
 */
class NotificationService {
    constructor(notificationRepository) {
        this._notificationRepository = notificationRepository;
    }
    createNotification(accessToken, notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to create the goal using the extracted user ID and provided goal data.
                const createdNotification = yield this._notificationRepository.createNotification(notificationData);
                return createdNotification;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error creating goal:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = NotificationService;
