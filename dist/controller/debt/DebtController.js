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
const zod_1 = require("zod");
const DebtDto_1 = __importDefault(require("dtos/debt/DebtDto"));
/**
 * @class DebtController
 * @description Controller class responsible for handling debt-related HTTP requests.
 * Acts as an intermediary between the Express routes and the service layer.
 */
class DebtController {
    /**
     * @constructor
     * @param {IDebtService} debtService - The service implementation to handle business logic.
     */
    constructor(debtService) {
        this._debtService = debtService;
    }
    /**
     * @method createDebt
     * @description Handles incoming requests to create a new debt record.
     * Extracts the access token from cookies, validates the request body using Zod schema,
     * and delegates creation logic to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    createDebt(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Validate request body against the Zod schema
                const dto = DebtDto_1.default.parse(request.body);
                // Delegate to the service layer
                const debt = yield this._debtService.createDebt(accessToken, dto);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.CREATED, successMessages_1.SuccessMessages.DEBT_CREATED_SUCCESSFULLY, { debt });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method getTotalDebt
     * @description Fetches the total outstanding debt amount for the authenticated user.
     * Extracts the access token from cookies, calls the service layer to calculate the debt,
     * and sends the result in a structured JSON response.
     *
     * @param {Request} request - Express request object containing cookies and request data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getTotalDebt(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer to calculate total outstanding debt
                const totalDebt = yield this._debtService.getTotalDebt(accessToken);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { totalDebt });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method getTotalOutstandingDebt
     * @description Fetches the total outstanding debt amount for the authenticated user.
     * Extracts the access token from cookies, delegates to the service layer,
     * and returns the result in a structured JSON response.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getTotalOutstandingDebt(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer
                const totalOutstandingDebt = yield this._debtService.getTotalOutstandingDebt(accessToken);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { totalOutstandingDebt });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method getTotalMonthlyPayment
     * @description Fetches the total monthly payment across all active debts for the authenticated user.
     * Extracts the access token from cookies, delegates to the service layer,
     * and returns the result in a structured JSON response.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getTotalMonthlyPayment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer
                const totalMonthlyPayment = yield this._debtService.getTotalMonthlyPayment(accessToken);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { totalMonthlyPayment });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method getLongestTenure
     * @description Calculates the longest difference in months between the end date of any active debt
     * and the current date for the authenticated user.
     *
     * This method extracts the access token from request cookies, decodes it to identify the user,
     * delegates the logic to the service layer to compute the maximum tenure in months,
     * and returns the result in a structured JSON response.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getLongestTenure(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer
                const maxTenure = yield this._debtService.getLongestTenure(accessToken);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { maxTenure });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method getDebtCategorized
     * @description Retrieves debts categorized as either 'Good Debt' or 'Bad Debt' for the authenticated user.
     *
     * This method extracts the access token from request cookies, decodes it to identify the user,
     * delegates the categorization logic to the service layer based on the provided category parameter,
     * and returns the filtered list of debts in a structured JSON response.
     *
     * @param {Request} request - Express request object containing cookies and route parameters.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getDebtCategorized(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                const { category } = request.query;
                if (typeof category !== 'string') {
                    throw new AppError_1.AppError('Invalid category parameter', statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the service layer
                const debtDetails = yield this._debtService.getDebtCategorized(accessToken, category);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { debtDetails });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method getRepaymentStrategyComparison
     * @description Handles HTTP requests to compare debt repayment strategies (e.g., Avalanche vs Snowball).
     *
     * This method extracts the JWT access token from request cookies,
     * reads an optional extra monthly payment amount from query parameters,
     * validates the input, and delegates to the service layer to perform the actual strategy comparison.
     * It then sends a structured JSON response containing results from both repayment strategies.
     *
     * @param {Request} request - Express request object containing cookies and query parameters.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getRepaymentStrategyComparison(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                const { extraAmount } = request.query;
                const parsedExtraAmount = typeof extraAmount === 'string' ? parseFloat(extraAmount) : 0;
                if (isNaN(parsedExtraAmount) || parsedExtraAmount < 0) {
                    throw new AppError_1.AppError('Invalid extra amount parameter', statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the service layer
                const repaymentComparisonResult = yield this._debtService.getRepaymentStrategyComparison(accessToken, parsedExtraAmount);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { repaymentComparisonResult });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method getAllDebts
     * @description Handles HTTP requests to retrieve all active debts for the authenticated user.
     *
     * This method extracts the JWT access token from request cookies to identify the user,
     * delegates to the service layer to fetch all non-completed and non-deleted debts,
     * and sends a structured JSON response containing the debt data.
     *
     * @param {Request} request - Express request object containing cookies used for authentication.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getAllDebts(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer
                const debtDetails = yield this._debtService.getAllDebts(accessToken);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { debtDetails });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method deleteDebt
     * @description Handles HTTP requests to delete a specific debt by ID.
     *
     * This method extracts the debt ID from request parameters,
     * delegates the deletion operation to the service layer,
     * and sends an appropriate JSON response indicating success or failure.
     *
     * @param {Request} request - Express request object containing the debt ID in params.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    deleteDebt(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const debtId = request.params.id;
                // Delegate to the service layer
                const isDeleted = yield this._debtService.deleteDebt(debtId);
                if (!isDeleted) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_REMOVE_DEBT);
                }
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.REMOVED_DEBT, { isDeleted });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * @method markAsPaid
     * @description Handles HTTP requests to mark a specific debt as paid.
     *
     * This method extracts the debt ID from request parameters,
     * delegates the update operation to the service layer (e.g., updating nextDueDate and resetting isExpired),
     * and sends an appropriate JSON response indicating success or failure.
     *
     * @param {Request} request - Express request object containing the debt ID in params.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    markAsPaid(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const debtId = request.params.id;
                // Delegate to the service layer
                const isUpdated = yield this._debtService.markAsPaid(debtId);
                if (!isUpdated) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_REMOVE_DEBT);
                }
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.UPDATED_SUCCESSFULLY, { isUpdated });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.log(error.errors);
                    // Format Zod validation errors
                    const errorMessages = error.errors.map(err => {
                        const path = err.path.join('.');
                        return `${path}: ${err.message}`;
                    }).join(', ');
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
                }
                else if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    console.error('Unexpected error:', error);
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = DebtController;
