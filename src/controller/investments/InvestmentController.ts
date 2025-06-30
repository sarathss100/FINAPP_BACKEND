import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { Request, Response } from 'express';
import { AppError, ValidationError } from 'error/AppError';
import { SuccessMessages } from 'constants/successMessages';
import IInvestmentService from 'services/investments/interfaces/IInvestmentService';
import IInvestmentController from './interfaces/IInvestmentController';
import { InvestmentDTOSchema } from 'dtos/investments/investmentDTO';
import { ZodError } from 'zod';

/**
 * @class InvestmentController
 * @description Controller class responsible for handling investment-related HTTP requests.
 * Acts as an intermediary between the Express routes and the service layer.
 */
class InvestmentController implements IInvestmentController {
    private readonly _investmentService: IInvestmentService;

    /**
     * @constructor
     * @param {IInvestmentService} investmentService - The service implementation to handle business logic.
     */
    constructor(investmentService: IInvestmentService) {
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
    async searchStocks(request: Request, response: Response): Promise<void> {
        try {
            const { keyword } = request.query;
            if (!keyword) {
                throw new ValidationError(ErrorMessages.MISSING_QUERY_PARAMETER, StatusCodes.BAD_REQUEST);
            }

            // Call the service layer to fetch the stocks based on the keyword
            const stocks = await this._investmentService.searchStocks(keyword as string);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { stocks });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
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
    async createInvestment(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            
            // First, check if the type field is present
            if (!request.body.type) {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, 'Investment type is required');
                return;
            }
    
            // Validate the investment type
            const validTypes = [
                'STOCK', 'MUTUAL_FUND', 'BOND', 'PROPERTY', 'BUSINESS', 
                'FIXED_DEPOSIT', 'EPFO', 'GOLD', 'PARKING_FUND'
            ];
            
            if (!validTypes.includes(request.body.type)) {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, 
                    `Invalid investment type. Must be one of: ${validTypes.join(', ')}`);
                return;
            }
    
            // Parse with the discriminated union schema
            const dto = InvestmentDTOSchema.parse(request.body);
    
            // Call the service to create the investment
            const investment = await this._investmentService.createInvestment(accessToken, dto);
    
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.OPERATION_SUCCESS, { investment });
        } catch (error) {
            if (error instanceof ZodError) {
                console.error('Validation errors:', error.errors);
                
                // Format Zod errors for better client understanding
                const errorMessages = error.errors.map(err => {
                    const path = err.path.join('.');
                    return `${path}: ${err.message}`;
                }).join(', ');
                
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, 
                    `Validation failed: ${errorMessages}`);
            } else if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
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
    async totalInvestedAmount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Call the service to get total investment amount
            const totalInvestedAmount = await this._investmentService.totalInvestment(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { totalInvestedAmount });
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
     * @method currentTotalValue
     * @description Handles incoming requests to fetch the current total value of all investments for the authenticated user.
     * Extracts the access token from cookies, authenticates the user, and delegates the calculation to the service layer.
     *
     * @param {Request} request - Express request object containing cookies and body data.
     * @param {Response} response - Express response object used to send the HTTP response.
     * @returns {Promise<void>}
     */
    async currentTotalValue(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Call the service to get current total value
            const currentTotalValue = await this._investmentService.currentTotalValue(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { currentTotalValue });
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

export default InvestmentController;
