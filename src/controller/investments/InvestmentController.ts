import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { Request, Response } from 'express';
import { AppError, AuthenticationError, ServerError, ValidationError } from 'error/AppError';
import { SuccessMessages } from 'constants/successMessages';
import IInvestmentService from 'services/investments/interfaces/IInvestmentService';
import IInvestmentController from './interfaces/IInvestmentController';

class InvestmentController implements IInvestmentController {
    private readonly _investmentService: IInvestmentService;

    constructor(investmentService: IInvestmentService) {
        this._investmentService = investmentService;
    }

    async removeAccount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { accountId } = request.params;
            if (!accountId || typeof accountId !== 'string') {
                throw new ValidationError(ErrorMessages.ACCOUNT_ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
            } 

            // Call the service layer to delete the account
            const isRemoved = await this._investmentService.removeAccount(accountId);
            if (!isRemoved) {
                throw new ServerError(ErrorMessages.FAILED_TO_DELETE_ACCOUNT);
            }

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.ACCOUNT_REMOVED);
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
