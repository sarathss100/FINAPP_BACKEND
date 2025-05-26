import { Request, Response } from 'express';
import { AppError, ServerError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { SuccessMessages } from 'constants/successMessages';
import IMutualFundController from './interfaces/IMutualFundController';
import IMutualFundService from 'services/mutualfunds/interfaces/IMutualFundService';

/**
 * Controller class responsible for handling Mutual Fund-related HTTP requests.
 */
class MutualFundController implements IMutualFundController {
    private readonly _mutualFundService: IMutualFundService;

    /**
     * Initializes a new instance of the MutualFundController.
     * @param mutualFundService - Service implementation for handling business logic.
     */
    constructor(mutualFundService: IMutualFundService) {
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
}

export default MutualFundController;
