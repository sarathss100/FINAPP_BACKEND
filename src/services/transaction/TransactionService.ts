import ITransactionRepository from 'repositories/transaction/interfaces/ITransactionRepository';
import ITransactionService from './interfaces/ITransaction';
import { ITransactionDTO } from 'dtos/transaction/TransactionDto';
import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';

/**
 * Service class for managing transaction, including creating and retrieving transactions.
 * This class interacts with the transaction repository to perform database operations.
 */
class TransactionService implements ITransactionService {
    private _transactionRepository: ITransactionRepository;

    /**
     * Constructs a new instance of the TransactionService.
     * 
     * @param {ITransactionRepository} TransactionRepository - The repository used for interacting with transaction data.
     */
    constructor(transactionRepository: ITransactionRepository) {
        this._transactionRepository = transactionRepository;
    }

    /**
     * Record transaction for the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @param {ITransactionDTO} data - The data required to create the transaction.
     * @returns {Promise<ITransactionDTO>} - A promise resolving to the created transaction object.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async createTransaction(accessToken: string, data: ITransactionDTO): Promise<ITransactionDTO> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
 
            const transactionData = { ...data, user_id: userId, };

            // Call the repository to create the transaction using the extracted user ID and provided transaction data.
            const createdTransaction = await this._transactionRepository.createTransaction(transactionData);

            return createdTransaction;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error creating transaction:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all transactions associated with the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of transaction objects associated with the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getUserTransactions(accessToken: string): Promise<ITransactionDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the transaction associated with the extracted user ID.
            const transactionDetails = await this._transactionRepository.getUserTransactions(userId);

            return transactionDetails;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving user transaction:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default TransactionService;
