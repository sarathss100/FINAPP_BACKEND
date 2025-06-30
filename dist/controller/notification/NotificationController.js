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
const NotificationDto_1 = __importDefault(require("dtos/notification/NotificationDto"));
class NotificationController {
    constructor(notificaitonService) {
        this._notificationService = notificaitonService;
    }
    createNotification(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Validate the request body using the Zod schema
                const parsedBody = NotificationDto_1.default.safeParse(request.body);
                if (!parsedBody.success) {
                    // If validation fails, extract the error details
                    const errors = parsedBody.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }));
                    console.error(errors);
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Extract the validated data
                const notificationData = parsedBody.data;
                // Call the service layer to create the goal
                const createdGoal = yield this._notificationService.createNotification(accessToken, notificationData);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.GOAL_CREATED, { createdGoal });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = NotificationController;
