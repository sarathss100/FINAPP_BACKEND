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
const responseHandler_1 = require("utils/responseHandler");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const AppError_1 = require("error/AppError");
const successMessages_1 = require("constants/successMessages");
const zod_1 = require("zod");
const investment_validation_1 = require("validation/investments/investment.validation");
/**
 * @class InvestmentController
 * @description Controller class responsible for handling investment-related HTTP requests.
 * Acts as an intermediary between the Express routes and the service layer.
 */
class InvestmentController {
    /**
     * @constructor
     * @param {IInvestmentService} investmentService - The service implementation to handle business logic.
     */
    constructor(investmentService) {
        this._investmentService = investmentService;
    }
    /**
     * @method searchStocks
     * @description Handles incoming requests to search for stocks based on a keyword using an external API.
     * Validates the presence of the query parameter before delegating to the service.
     *
     * @param {Request} request - Express request object containing the query parameter.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    searchStocks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { keyword } = request.query;
                if (!keyword) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.MISSING_QUERY_PARAMETER, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the service layer to fetch the stocks based on the keyword
                const stocks = yield this._investmentService.searchStocks(keyword);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { stocks });
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
     * @method createInvestment
     * @description Handles incoming requests to create a new investment.
     * Extracts the access token from cookies and validates the request body using Zod schema.
     * Delegates creation logic to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    createInvestment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // First, check if the type field is present
                if (!request.body.type) {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, 'Investment type is required');
                    return;
                }
                // Validate the investment type
                const validTypes = [
                    'STOCK', 'MUTUAL_FUND', 'BOND', 'PROPERTY', 'BUSINESS',
                    'FIXED_DEPOSIT', 'EPFO', 'GOLD', 'PARKING_FUND'
                ];
                if (!validTypes.includes(request.body.type)) {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, `Invalid investment type. Must be one of: ${validTypes.join(', ')}`);
                    return;
                }
                // Parse with the discriminated union schema
                const dto = investment_validation_1.InvestmentDTOSchema.parse(request.body);
                // Call the service to create the investment
                const investment = yield this._investmentService.createInvestment(accessToken, dto);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.CREATED, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { investment });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    console.error('Validation errors:', error.errors);
                    // Format Zod errors for better client understanding
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
     * @method totalInvestedAmount
     * @description Handles incoming requests to fetch the total initial investment amount for the authenticated user.
     * Extracts the access token from cookies, authenticates the user, and delegates the calculation to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    totalInvestedAmount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Call the service to get total investment amount
                const totalInvestedAmount = yield this._investmentService.totalInvestment(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { totalInvestedAmount });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
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
     * @method currentTotalValue
     * @description Handles incoming requests to fetch the current total value of all investments for the authenticated user.
     * Extracts the access token from cookies, authenticates the user, and delegates the calculation to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    currentTotalValue(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Call the service to get current total value
                const currentTotalValue = yield this._investmentService.currentTotalValue(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { currentTotalValue });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
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
     * @method getTotalReturns
     * @description Handles incoming requests to fetch the total returns (profit or loss)
     * from all investments for the authenticated user.
     * Extracts the access token from cookies, authenticates the user, and delegates
     * the calculation to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getTotalReturns(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Call the service to get total returns (profit or loss)
                const totalReturns = yield this._investmentService.getTotalReturns(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { totalReturns });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
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
     * @method getCategorizedInvestments
     * @description Handles incoming requests to fetch and return all investments for the authenticated user,
     * grouped by investment type (e.g., STOCK, MUTUAL_FUND).
     * Extracts the access token from cookies, authenticates the user, and delegates the data fetching to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getCategorizedInvestments(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Call the service to get categorized investments
                const investments = yield this._investmentService.getCategorizedInvestments(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { investments });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
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
     * @method removeInvestment
     * @description Handles incoming requests to delete an investment of a specific type and ID.
     * Extracts the investment type and ID from request parameters and delegates the deletion logic to the service layer.
     * Sends a success response if the deletion is successful, or an error response if something goes wrong.
     *
     * @param {Request} request - Express request object containing the investment type and ID in params.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    removeInvestment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { investmentType, investmentId } = request.params;
                // Call the service to perform the deletion
                yield this._investmentService.removeInvestment(investmentType, investmentId);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.INVESTMENT_REMOVED);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
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
exports.default = InvestmentController;
