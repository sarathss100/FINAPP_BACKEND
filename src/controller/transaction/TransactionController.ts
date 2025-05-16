import ITransactionService from 'services/transaction/interfaces/ITransaction';
import ITransactionController from './interfaces/ITransactionController';
import { Request, Response } from 'express';
import { AppError, AuthenticationError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import transactionDTOSchema, { ITransactionDTO } from 'dtos/transaction/TransactionDto';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { SuccessMessages } from 'constants/successMessages';

class TransactionController implements ITransactionController {
    private readonly _transactionService: ITransactionService;

    constructor(transactionService: ITransactionService) {
        this._transactionService = transactionService;
    }

    async createTransaction(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Validate the request body using the Zod schema
            const parsedBody = transactionDTOSchema.safeParse(request.body);

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
            const transactionData = parsedBody.data;
            
            // Call the service layer to create the transaction
            const createdTransaction = await this._transactionService.createTransaction(accessToken, transactionData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_CREATED, { createdTransaction } );
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getUserTransactions(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user transactions
            const allTransactions: ITransactionDTO[] = await this._transactionService.getUserTransactions(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, { allTransactions });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getMonthlyTotalIncome(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user transactions
            const userMonthlyTotals = await this._transactionService.getMonthlyTotalIncome(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, { ...userMonthlyTotals });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getMonthlyTotalExpense(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user transactions
            const totalMonthlyExpense = await this._transactionService.getMonthlyTotalExpense(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, { totalMonthlyExpense });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getCategoryWiseExpense(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user transactions
            const categoryWiseExpenses = await this._transactionService.getCategoryWiseExpense(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, { categoryWiseExpenses });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default TransactionController;
