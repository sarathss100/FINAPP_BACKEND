import { sendErrorResponse, sendSuccessResponse } from '../../utils/responseHandler';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { AppError } from '../../error/AppError';
import { SuccessMessages } from '../../constants/successMessages';
import { ZodError } from 'zod';
import IInsuranceController from './interfaces/IInsuranceController';
import IInsuranceService from '../../services/insurances/interfaces/IInsuranceService';
import { insuranceDTOSchema } from '../../validation/insurances/insurance.validation';

class InsuranceController implements IInsuranceController {
    private readonly _insuranceService: IInsuranceService;

    /**
     * @constructor
     * @param {IInsuranceService} insuranceService - The service implementation to handle business logic.
     */
    constructor(insuranceService: IInsuranceService) {
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
    async createInsurance(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            
            // Validate request body against the Zod schema
            const dto = insuranceDTOSchema.parse(request.body.formData);

            // Delegate to the service layer
            const insurance = await this._insuranceService.createInsurance(accessToken, dto);

            // Send success response
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.OPERATION_SUCCESS, { insurance });
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors
                const errorMessages = error.errors.map(err => {
                    const path = err.path.join('.');
                    return `${path}: ${err.message}`;
                }).join(', ');

                sendErrorResponse(response, StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
            } else if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
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
    async removeInsurance(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;

            // Delegate to the service layer to remove the insurance
            const isInsuranceRemoved = await this._insuranceService.removeInsurance(id);

            if (!isInsuranceRemoved) {
                throw new AppError(ErrorMessages.FAILED_TO_REMOVE_INSURANCE, StatusCodes.NOT_FOUND);
            }

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INSURANCE_DELETED_SUCCESSFULLY,{ deleted: isInsuranceRemoved });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
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
    async getUserInsuranceCoverageTotal(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Delegate to the service layer to remove the insurance
            const totalInsuranceCoverage = await this._insuranceService.getUserInsuranceCoverageTotal(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INSURANCE_COVERAGE_RETRIEVED,{ totalInsuranceCoverage });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
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
    async getUserTotalPremiumAmount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Delegate to the service layer to calculate the total premium
            const totalPremium = await this._insuranceService.getUserTotalPremiumAmount(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INSURANCE_COVERAGE_RETRIEVED,{ totalPremium });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
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
    async getAllInsurances(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            // Delegate to the service layer to fetch all insurance records
            const insuranceDetails = await this._insuranceService.getAllInsurances(accessToken);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INSURANCES_RETRIEVED, { insuranceDetails });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
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
    async getClosestNextPaymentDate(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            // Delegate to the service layer to fetch the closest next payment date
            const insurance = await this._insuranceService.getClosestNextPaymentDate(accessToken);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.NEXT_PAYMENT_DATE_RETRIEVED, { insurance });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
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
    async markPaymentAsPaid(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;
        
            // Delegate the update operation to the service layer
            const isUpdated = await this._insuranceService.markPaymentAsPaid(id);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.PAYMENT_STATUS_UPDATED, { isUpdated });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default InsuranceController;
