import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { Request, Response } from 'express';
import { AppError } from 'error/AppError';
import { SuccessMessages } from 'constants/successMessages';
import { ZodError } from 'zod';
import IDebtController from './interfaces/IDebtController';
import IDebtService from 'services/debt/interfaces/IDebtService';
import debtDTOSchema from 'dtos/debt/DebtDto';

/**
 * @class DebtController
 * @description Controller class responsible for handling debt-related HTTP requests.
 * Acts as an intermediary between the Express routes and the service layer.
 */
class DebtController implements IDebtController {
    private readonly _debtService: IDebtService;

    /**
     * @constructor
     * @param {IDebtService} debtService - The service implementation to handle business logic.
     */
    constructor(debtService: IDebtService) {
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
    async createDebt(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Validate request body against the Zod schema
            const dto = debtDTOSchema.parse(request.body);

            // Delegate to the service layer
            const debt = await this._debtService.createDebt(accessToken, dto);

            // Send success response
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.DEBT_CREATED_SUCCESSFULLY, { debt });
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.errors);
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
     * @method getTotalDebt
     * @description Fetches the total outstanding debt amount for the authenticated user.
     * Extracts the access token from cookies, calls the service layer to calculate the debt,
     * and sends the result in a structured JSON response.
     *
     * @param {Request} request - Express request object containing cookies and request data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    async getTotalDebt(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            // Delegate to the service layer to calculate total outstanding debt
            const totalDebt = await this._debtService.getTotalDebt(accessToken);
        
            // Send success response
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { totalDebt });
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.errors);
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
     * @method getTotalOutstandingDebt
     * @description Fetches the total outstanding debt amount for the authenticated user.
     * Extracts the access token from cookies, delegates to the service layer,
     * and returns the result in a structured JSON response.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    async getTotalOutstandingDebt(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Delegate to the service layer
            const totalOutstandingDebt = await this._debtService.getTotalOutstandingDebt(accessToken);

            // Send success response
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { totalOutstandingDebt });
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.errors);
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
     * @method getTotalMonthlyPayment
     * @description Fetches the total monthly payment across all active debts for the authenticated user.
     * Extracts the access token from cookies, delegates to the service layer,
     * and returns the result in a structured JSON response.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    async getTotalMonthlyPayment(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            // Delegate to the service layer
            const totalMonthlyPayment = await this._debtService.getTotalMonthlyPayment(accessToken);
        
            // Send success response
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { totalMonthlyPayment });
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.errors);
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
    async getLongestTenure(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            // Delegate to the service layer
            const maxTenure = await this._debtService.getLongestTenure(accessToken);
        
            // Send success response
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { maxTenure });
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.errors);
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
}

export default DebtController;
