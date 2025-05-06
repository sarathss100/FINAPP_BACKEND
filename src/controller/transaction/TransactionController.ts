import ITransactionService from 'services/transaction/interfaces/ITransaction';
import ITransactionController from './interfaces/ITransactionController';
import { Request, Response } from 'express';
import { AppError, AuthenticationError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import transactionDTOSchema from 'dtos/transaction/TransactionDto';
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
}

export default TransactionController;
