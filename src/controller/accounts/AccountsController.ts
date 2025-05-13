import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { Request, Response } from 'express';
import { AppError, AuthenticationError, ServerError, ValidationError } from 'error/AppError';
import { SuccessMessages } from 'constants/successMessages';
import IAccountsController from './interfaces/IAccountsController';
import IAccountsService from 'services/accounts/interfaces/IAccountsService';
import { accountDTOSchema, IAccountDTO } from 'dtos/accounts/AccountsDTO';

class AccountsController implements IAccountsController {
    private readonly _accountsService: IAccountsService;

    constructor(accountsService: IAccountsService) {
        this._accountsService = accountsService;
    }

    async addAccount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const parsedBody = accountDTOSchema.safeParse(request.body);

            if (!parsedBody || !parsedBody.success) {
                // If validation fails, extract the error details
                const errors = parsedBody.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                console.error(errors);

                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }

            // Extract the validated data
            const accountData = parsedBody.data;
            
            // Call the service layer to create the goal
            const addedAccount = await this._accountsService.addAccount(accessToken, accountData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.ACCOUNT_ADDED, { addedAccount } );
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async updateAccount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { _id } = request.body;
            if (!_id || typeof _id !== 'string') {
                throw new ValidationError(ErrorMessages.ACCOUNT_ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
            } 

            const partialaccountsDTOSchema = accountDTOSchema.partial();

            // Validate the request body using the Zod schema
            const parsedBody = partialaccountsDTOSchema.safeParse(request.body);

            if (!parsedBody.success) {
                // If validation fails, extract the error details
                const errors = parsedBody.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                console.error(errors);

                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }

            // Extract the validated data
            const accountData = parsedBody.data;
            
            // Call the service layer to update the accounts
            const updatedAccount = await this._accountsService.updateAccount(accessToken, _id, accountData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_ACCOUNT_UPDATED, { updatedAccount } );
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async removeAccount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { accountId } = request.query;
            if (!accountId || typeof accountId !== 'string') {
                throw new ValidationError(ErrorMessages.ACCOUNT_ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
            } 

            // Call the service layer to delete the account
            const isRemoved = await this._accountsService.removeAccount(accountId);
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

    async getUserAccounts(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user accounts
            const userAccountDetails: IAccountDTO[] = await this._accountsService.getUserAccounts(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_RETRIEVED, { ...userAccountDetails });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default AccountsController;
