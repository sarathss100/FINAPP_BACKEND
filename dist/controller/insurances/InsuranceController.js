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
const insuranceDTO_1 = require("dtos/insurances/insuranceDTO");
/**
 * @class InsuranceController
 * @description Controller class responsible for handling insurance-related HTTP requests.
 * Acts as an intermediary between the Express routes and the service layer.
 */
class InsuranceController {
    /**
     * @constructor
     * @param {IInsuranceService} insuranceService - The service implementation to handle business logic.
     */
    constructor(insuranceService) {
        this._insuranceService = insuranceService;
    }
    /**
     * @method createInsurance
     * @description Handles incoming requests to create a new insurance record.
     * Extracts the access token from cookies, validates the request body using Zod schema,
     * and delegates creation logic to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    createInsurance(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Validate request body against the Zod schema
                const dto = insuranceDTO_1.insuranceDTOSchema.parse(request.body.formData);
                // Delegate to the service layer
                const insurance = yield this._insuranceService.createInsurance(accessToken, dto);
                // Send success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.CREATED, successMessages_1.SuccessMessages.OPERATION_SUCCESS, { insurance });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
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
     * @method removeInsurance
     * @description Handles incoming requests to delete an insurance record by its ID.
     * Extracts the insurance ID from request parameters, delegates deletion logic to the service layer,
     * and sends an appropriate HTTP response based on the result.
     *
     * @param {Request} request - Express request object containing URL parameters and cookies.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    removeInsurance(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                // Delegate to the service layer to remove the insurance
                const isInsuranceRemoved = yield this._insuranceService.removeInsurance(id);
                if (!isInsuranceRemoved) {
                    throw new AppError_1.AppError(errorMessages_1.ErrorMessages.FAILED_TO_REMOVE_INSURANCE, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.INSURANCE_DELETED_SUCCESSFULLY, { deleted: isInsuranceRemoved });
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
     * @method removeInsurance
     * @description Handles incoming requests to delete an insurance record by its ID.
     * Extracts the insurance ID from request parameters, delegates deletion logic to the service layer,
     * and sends an appropriate HTTP response based on the result.
     *
     * @param {Request} request - Express request object containing URL parameters and cookies.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getUserInsuranceCoverageTotal(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer to remove the insurance
                const totalInsuranceCoverage = yield this._insuranceService.getUserInsuranceCoverageTotal(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.INSURANCE_COVERAGE_RETRIEVED, { totalInsuranceCoverage });
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
     * @method getUserTotalPremiumAmount
     * @description Handles incoming requests to retrieve the total premium amount from active insurance policies for the authenticated user.
     * Extracts the access token from cookies, delegates the calculation logic to the service layer,
     * and sends back the result in the HTTP response.
     *
     * @param {Request} request - Express request object containing cookies and authentication data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getUserTotalPremiumAmount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer to calculate the total premium
                const totalPremium = yield this._insuranceService.getUserTotalPremiumAmount(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.INSURANCE_COVERAGE_RETRIEVED, { totalPremium });
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
     * @method getAllInsurances
     * @description Handles incoming requests to retrieve all insurance records for the authenticated user.
     * Extracts the access token from cookies, delegates the data fetching logic to the service layer,
     * and sends back the list of insurances in the HTTP response.
     *
     * @param {Request} request - Express request object containing cookies and authentication data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getAllInsurances(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer to fetch all insurance records
                const insuranceDetails = yield this._insuranceService.getAllInsurances(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.INSURANCES_RETRIEVED, { insuranceDetails });
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
     * @method getClosestNextPaymentDate
     * @description Handles incoming requests to retrieve the closest upcoming next payment date
     * among all insurance records for the authenticated user.
     * Extracts the access token from cookies, delegates the logic to the service layer,
     * and sends back the result in the HTTP response.
     *
     * @param {Request} request - Express request object containing cookies and authentication data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    getClosestNextPaymentDate(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                // Delegate to the service layer to fetch the closest next payment date
                const insurance = yield this._insuranceService.getClosestNextPaymentDate(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.NEXT_PAYMENT_DATE_RETRIEVED, { insurance });
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
     * @method markPaymentAsPaid
     * @description Handles incoming requests to update the payment status of an insurance policy to "paid".
     * Extracts the insurance ID from request parameters, delegates the update logic to the service layer,
     * and sends back a success response upon completion.
     *
     * @param {Request} request - Express request object containing route parameters and data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    markPaymentAsPaid(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                // Delegate the update operation to the service layer
                const isUpdated = yield this._insuranceService.markPaymentAsPaid(id);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.PAYMENT_STATUS_UPDATED, { isUpdated });
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
exports.default = InsuranceController;
