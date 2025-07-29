import { sendSuccessResponse } from '../../utils/responseHandler';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { ServerError, ValidationError } from '../../error/AppError';
import { SuccessMessages } from '../../constants/successMessages'; 
import IAccountsController from './interfaces/IAccountsController';
import IAccountsService from '../../services/accounts/interfaces/IAccountsService';
import { IAccountDTO } from '../../dtos/accounts/IAccountsDTO'; 
import accountValidationSchema from '../../validation/accounts/account.validation';
import { getAccessTokenOrThrow, handleControllerError } from '../../utils/controllerUtils';

export default class AccountsController implements IAccountsController {
    private readonly _accountsService: IAccountsService;

    constructor(accountsService: IAccountsService) {
        this._accountsService = accountsService;
    }

    async addAccount(request: Request, response: Response): Promise<void> {
        try {
            const accessToken = getAccessTokenOrThrow(request);

            const data = request.body;
            const formData: Partial<IAccountDTO> = {};

            for (const key in data) {
                // Only include fields that aren't empty strings
                if (data[key] !== '' && data[key] !== undefined) {
                    formData[key as keyof IAccountDTO] = data[key];
                }
            }

            const parsedBody = accountValidationSchema.safeParse(formData);

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
            handleControllerError(response, error);
        }
    }

    async updateAccount(request: Request, response: Response): Promise<void> {
        try {
            const accessToken = getAccessTokenOrThrow(request);

            const { accountId } = request.params;
            const { accountData } = request.body;
            if (!accountId) {
                throw new ValidationError(ErrorMessages.ACCOUNT_ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
            } 

            const partialaccountsDTOSchema = accountValidationSchema.partial();

            // Validate the request body using the Zod schema
            const parsedBody = partialaccountsDTOSchema.safeParse(accountData);

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
            const extractedAccountData = parsedBody.data;
            
            // Call the service layer to update the accounts
            const updatedAccount = await this._accountsService.updateAccount(accessToken, accountId, extractedAccountData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_ACCOUNT_UPDATED, { updatedAccount } );
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async removeAccount(request: Request, response: Response): Promise<void> {
        try {
            const { accountId } = request.params;
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
            handleControllerError(response, error);
        }
    }

    async getUserAccounts(request: Request, response: Response): Promise<void> {
        try {
            const accessToken = getAccessTokenOrThrow(request);

            // Call the service layer to get the user accounts
            const userAccountDetails: IAccountDTO[] = await this._accountsService.getUserAccounts(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_RETRIEVED, { ...userAccountDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalBalance(request: Request, response: Response): Promise<void> {
        try {
            const accessToken = getAccessTokenOrThrow(request);

            // Call the service layer to get the user total Balance
            const totalBalance = await this._accountsService.getTotalBalance(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.ACCOUNT_TOTAL_BALANCE, { totalBalance });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalBankBalance(request: Request, response: Response): Promise<void> {
        try {
            const accessToken = getAccessTokenOrThrow(request);

            // Call the service layer to get the user total Bank Balance
            const totalBankBalance = await this._accountsService.getTotalBankBalance(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.ACCOUNT_TOTAL_BANK_BALANCE, { totalBankBalance });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalDebt(request: Request, response: Response): Promise<void> {
        try {
            const accessToken = getAccessTokenOrThrow(request);

            // Call the service layer to get the user total Debt
            const totalDebt = await this._accountsService.getTotalDebt(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.ACCOUNT_TOTAL_DEBT, { totalDebt });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalInvestment(request: Request, response: Response): Promise<void> {
        try {
            const accessToken = getAccessTokenOrThrow(request);

            // Call the service layer to get the user total Investment
            const totalInvestment = await this._accountsService.getTotalInvestment(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.ACCOUNT_TOTAL_INVESTMENT, { totalInvestment });
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}
