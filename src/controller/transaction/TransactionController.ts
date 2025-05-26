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

        // Check if the request body is an array or a single object
        const isArray = Array.isArray(request.body);
        
        if (isArray) {
            // Handle array of transactions
            const validatedTransactions = [];
            const validationErrors = [];
            
            // Validate each transaction in the array
            for (let i = 0; i < request.body.length; i++) {
                const parsedTransaction = transactionDTOSchema.safeParse(request.body[i]);
                
                if (parsedTransaction.success) {
                    validatedTransactions.push(parsedTransaction.data);
                } else {
                    // Collect validation errors for each failed transaction
                    const errors = parsedTransaction.error.errors.map(err => ({
                        transactionIndex: i,
                        field: err.path.join('.'),
                        message: err.message
                    }));
                    validationErrors.push(...errors);
                }
            }
            
            // If there are validation errors, return them
            if (validationErrors.length > 0) {
                console.error(validationErrors);
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }
            
            // Call the service layer to create multiple transactions
            const createdTransactions = await this._transactionService.createTransaction(accessToken, validatedTransactions);
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_CREATED, { addedTransactions: createdTransactions });
        } else {
            // Handle single transaction (original logic)
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
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_CREATED, { addedTransaction: createdTransaction });
        }
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

    async extractTransactionData(request: Request, response: Response): Promise<void> {
        try {
            const file = request.file; // Multer provides the file object 
            if (!file) {
                throw new ValidationError(ErrorMessages.STATEMENT_FILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
            }

            // Call the service layer to extract the transaction data from the uploaded file
            const extractedStatementData = await this._transactionService.extractTransactionData(file);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { extractedStatementData });
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
