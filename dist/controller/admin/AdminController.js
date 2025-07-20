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
const statusCodes_1 = require("constants/statusCodes");
const responseHandler_1 = require("utils/responseHandler");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const successMessages_1 = require("constants/successMessages");
const faq_validation_1 = __importDefault(require("validation/base/faq.validation"));
const faqQueryValidation_1 = __importDefault(require("validation/admin/faqQueryValidation"));
class AdminController {
    constructor(adminService) {
        this._adminService = adminService;
    }
    getAllUsers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the getAllUsers method from AuthService
                const usersDetails = yield this._adminService.getAllUsers();
                if (usersDetails) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, Object.assign({}, usersDetails));
                }
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
    toggleUserStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, status } = request.body;
                if (!userId || typeof status !== 'boolean') {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.INVALID_INPUT);
                }
                // Call the toggleUserStatus in the adminService
                const isUpdated = yield this._adminService.toggleUserStatus(userId, status);
                if (isUpdated) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, errorMessages_1.ErrorMessages.STATUS_UPDATE_FAILED);
                }
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
    addFaq(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the request body using zod
                const parsedData = faq_validation_1.default.safeParse(request.body);
                if (!parsedData.success) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.INVALID_INPUT);
                }
                const { question, answer } = parsedData.data;
                // Call the add FAQ in the adminService
                const isAdded = yield this._adminService.addFaq({ question, answer });
                if (isAdded) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.FAQ_ADDED, { isAdded });
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, errorMessages_1.ErrorMessages.FAILED_TO_ADD_THE_FAQ);
                }
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
    getAllFaqsForAdmin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = faqQueryValidation_1.default.safeParse(request.query);
                if (!validationResult.success) {
                    const formattedErrors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, 'Invalid query parameters', formattedErrors);
                    return;
                }
                const { page, limit, search } = validationResult.data;
                const faqDetails = yield this._adminService.getAllFaqsForAdmin(page, limit, search);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.FAQ_FETCHED_SUCCESSFULLY, Object.assign({}, faqDetails));
            }
            catch (error) {
                console.error(`Error fetching FAQs:`, error);
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    getAllFaqs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the getall FAQ details in the adminService
                const faqDetails = yield this._adminService.getAllFaqs();
                if (faqDetails) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.FAQ_ADDED, { faqDetails });
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, errorMessages_1.ErrorMessages.FAILED_TO_ADD_THE_FAQ);
                }
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
    /**
     * Controller to handle FAQ deletion via HTTP DELETE request.
     *
     * Extracts the FAQ ID from the request parameters, calls the service to delete the FAQ,
     * and sends an appropriate success or error response.
     *
     * @param {Request} request - Express Request object containing the FAQ ID in `params.id`.
     * @param {Response} response - Express Response object to send the response.
     * @returns {Promise<void>} Sends response via Express; does not return a value.
     */
    deleteFaq(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faqId = request.params.id;
                // Call the delete FAQ method in the admin service
                const isRemoved = yield this._adminService.deleteFaq(faqId);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.FAQ_DELETED_SUCCESSFULLY, { isRemoved });
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
    /**
     * Controller to handle toggling the publish status of an FAQ via an HTTP PATCH request.
     *
     * Extracts the FAQ ID from the request parameters, calls the service to toggle the
     * 'isPublished' status of the FAQ, and sends an appropriate success or error response.
     *
     * @param {Request} request - Express Request object containing the FAQ ID in `params.id`.
     * @param {Response} response - Express Response object to send the response.
     * @returns {Promise<void>} Sends response via Express; does not return a value.
     */
    togglePublish(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faqId = request.params.id;
                // Call the service method to toggle the publish status
                const isToggled = yield this._adminService.togglePublish(faqId);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.FAQ_UPDATED_SUCCESSFULLY, { isToggled });
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
    /**
     * Controller to handle updating an FAQ entry via an HTTP PATCH request.
     *
     * Extracts the FAQ ID from the request parameters and the update data from the request body.
     * Validates the input using the FAQ schema, calls the service to update the FAQ,
     * and sends an appropriate success or error response.
     *
     * @param {Request} request - Express Request object containing the FAQ ID in `params.id` and update data in `body`.
     * @param {Response} response - Express Response object to send the response.
     * @returns {Promise<void>} Sends response via Express; does not return a value.
     */
    updateFaq(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faqId = request.params.id;
                // Validate the request body using zod
                const parsedData = faq_validation_1.default.safeParse(request.body);
                if (!parsedData.success) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the service method to update the FAQ
                const isUpdated = yield this._adminService.updateFaq(faqId, Object.assign({}, parsedData.data));
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.FAQ_UPDATED_SUCCESSFULLY, { isUpdated });
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
    getNewRegistrationCount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the getNewRegistrationCount method from AuthService
                const newRegistrationCount = yield this._adminService.getNewRegistrationCount();
                if (newRegistrationCount !== undefined) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { newRegistrationCount });
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, errorMessages_1.ErrorMessages.FAILED_TO_FETCH_REGISTRATION_COUNT);
                }
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
    getHealthStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the getHealthStatus method from AuthService
                const healthStatus = yield this._adminService.getHealthStatus();
                if (healthStatus) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { healthStatus });
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, errorMessages_1.ErrorMessages.FAILED_TO_FETCH_HEALTH_STATUS);
                }
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
    getSystemMetrics(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the get System Metrics method from AuthService
                const usageStatics = yield this._adminService.getSystemMetrics();
                if (usageStatics) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { usageStatics });
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, errorMessages_1.ErrorMessages.FAILED_TO_FETCH_HEALTH_STATUS);
                }
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
exports.default = AdminController;
