import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { Request, Response } from 'express';
import { AppError, ValidationError } from 'error/AppError';
import { SuccessMessages } from 'constants/successMessages';
import IInvestmentService from 'services/investments/interfaces/IInvestmentService';
import IInvestmentController from './interfaces/IInvestmentController';

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
}

export default InvestmentController;
