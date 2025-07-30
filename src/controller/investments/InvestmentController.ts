import { sendErrorResponse, sendSuccessResponse } from '../../utils/responseHandler';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { AppError, ValidationError } from '../../error/AppError';
import { SuccessMessages } from '../../constants/successMessages';
import IInvestmentService from '../../services/investments/interfaces/IInvestmentService';
import IInvestmentController from './interfaces/IInvestmentController';
import { ZodError } from 'zod';
import { InvestmentDTOSchema } from '../../validation/investments/investment.validation';

class InvestmentController implements IInvestmentController {
    private readonly _investmentService: IInvestmentService;

    constructor(investmentService: IInvestmentService) {
        this._investmentService = investmentService;
    }

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

    async getTotalReturns(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Call the service to get total returns (profit or loss)
            const totalReturns = await this._investmentService.getTotalReturns(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { totalReturns });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getCategorizedInvestments(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Call the service to get categorized investments
            const investments = await this._investmentService.getCategorizedInvestments(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { investments });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async removeInvestment(request: Request, response: Response): Promise<void> {
        try {
            const { investmentType, investmentId } = request.params;

            // Call the service to perform the deletion
            await this._investmentService.removeInvestment(investmentType, investmentId);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INVESTMENT_REMOVED);
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
