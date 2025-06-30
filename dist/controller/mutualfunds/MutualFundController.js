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
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const responseHandler_1 = require("utils/responseHandler");
const successMessages_1 = require("constants/successMessages");
/**
 * Controller class responsible for handling Mutual Fund-related HTTP requests.
 */
class MutualFundController {
    /**
     * Initializes a new instance of the MutualFundController.
     * @param mutualFundService - Service implementation for handling business logic.
     */
    constructor(mutualFundService) {
        this._mutualFundService = mutualFundService;
    }
    /**
     * Synchronizes Mutual Fund Net Asset Value (NAV) data from an external source.
     * Fetches the latest NAV values and updates the database.
     *
     * @param request - Express Request object.
     * @param response - Express Response object.
     * @returns A promise that resolves to void.
     */
    syncNavData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delegate NAV synchronization task to the service layer
                const isNavDataSynched = yield this._mutualFundService.syncNavData();
                // If synchronization fails at the service level, throw an error
                if (!isNavDataSynched) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.NAV_SYNC_FAILED);
                }
                // Send success response with result status
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.NAV_SYNCHED, {
                    isNavDataSynched,
                });
            }
            catch (error) {
                // Handle known application errors with custom status and message
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    // Handle unexpected generic errors
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Handles incoming requests to search for mutual funds by scheme name or code.
     *
     * Validates the query parameter and delegates the search operation to the service layer.
     * Returns a list of matching mutual fund records to the client.
     *
     * @param {Request} request - Express Request object containing the search query.
     * @param {Response} response - Express Response object used to send the response.
     * @returns {Promise<void>} - A promise that resolves once the response is sent.
     */
    searchMutualFunds(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { keyword } = request.query;
                if (!keyword || typeof keyword !== 'string') {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.MUTUAL_FUND_SEARCH_INVALID_QUERY, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate search task to the service layer
                const mutualFunds = yield this._mutualFundService.searchMutualFunds(keyword);
                // Send success response with search results
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.MUTUAL_FUND_SEARCH_SUCCESS, {
                    mutualFunds,
                });
            }
            catch (error) {
                // Handle known application errors with custom status and message
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    // Handle unexpected generic errors
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Handles incoming requests to retrieve mutual fund details by scheme code.
     *
     * Validates the 'schemCode' query parameter from the request, delegates the data-fetching
     * operation to the service layer, and sends the response to the client.
     *
     * @param {Request} request - Express Request object containing the incoming HTTP request.
     * @param {Response} response - Express Response object used to send the response.
     * @returns {Promise<void>} - A promise that resolves once the response is sent.
     */
    getMutualFundDetails(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { schemCode } = request.query;
                if (!schemCode || typeof schemCode !== 'string') {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.MUTUAL_FUND_SEARCH_INVALID_QUERY, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate task to the service layer to fetch mutual fund details by scheme code
                const mutualFunds = yield this._mutualFundService.getMutualFundDetails(schemCode);
                // Send success response with the retrieved mutual fund data
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.MUTUAL_FUND_SEARCH_SUCCESS, { mutualFunds });
            }
            catch (error) {
                // Handle known application errors with custom status and message
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    // Handle unexpected generic errors
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = MutualFundController;
