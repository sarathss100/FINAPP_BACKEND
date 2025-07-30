import { Request, Response } from 'express';
import { AppError, ServerError, ValidationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { sendErrorResponse, sendSuccessResponse } from '../../utils/responseHandler';
import { SuccessMessages } from '../../constants/successMessages';
import IMutualFundController from './interfaces/IMutualFundController';
import IMutualFundService from '../../services/mutualfunds/interfaces/IMutualFundService';

class MutualFundController implements IMutualFundController {
    private readonly _mutualFundService: IMutualFundService;

    constructor(mutualFundService: IMutualFundService) {
        this._mutualFundService = mutualFundService;
    }

    async syncNavData(request: Request, response: Response): Promise<void> {
        try {
            // Delegate NAV synchronization task to the service layer
            const isNavDataSynched = await this._mutualFundService.syncNavData();

            // If synchronization fails at the service level, throw an error
            if (!isNavDataSynched) {
                throw new ServerError(ErrorMessages.NAV_SYNC_FAILED);
            }

            // Send success response with result status
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.NAV_SYNCHED, {
                isNavDataSynched,
            });
        } catch (error) {
            // Handle known application errors with custom status and message
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                // Handle unexpected generic errors
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async searchMutualFunds(request: Request, response: Response): Promise<void> {
        try {
            const { keyword } = request.query;

            if (!keyword || typeof keyword !== 'string') {
                throw new ValidationError(ErrorMessages.MUTUAL_FUND_SEARCH_INVALID_QUERY, StatusCodes.BAD_REQUEST);
            } 

            // Delegate search task to the service layer
            const mutualFunds = await this._mutualFundService.searchMutualFunds(keyword);

            // Send success response with search results
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.MUTUAL_FUND_SEARCH_SUCCESS, {
                mutualFunds,
            });
        } catch (error) {
            // Handle known application errors with custom status and message
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                // Handle unexpected generic errors
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getMutualFundDetails(request: Request, response: Response): Promise<void> {
        try {
            const { schemCode } = request.query;

            if (!schemCode || typeof schemCode !== 'string') {
                throw new ValidationError(
                    ErrorMessages.MUTUAL_FUND_SEARCH_INVALID_QUERY,
                    StatusCodes.BAD_REQUEST
                );
            }

            // Delegate task to the service layer to fetch mutual fund details by scheme code
            const mutualFunds = await this._mutualFundService.getMutualFundDetails(schemCode);

            // Send success response with the retrieved mutual fund data
            sendSuccessResponse(
                response,
                StatusCodes.OK,
                SuccessMessages.MUTUAL_FUND_SEARCH_SUCCESS,
                { mutualFunds }
            );
        } catch (error) {
            // Handle known application errors with custom status and message
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                // Handle unexpected generic errors
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default MutualFundController;
