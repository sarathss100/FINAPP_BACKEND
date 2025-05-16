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

    /**
     * Calculates and returns the total income for the current and previous month 
     * for the authenticated user based on their access token.
     *
     * This method ensures:
     * - The user is authenticated via a valid JWT access token.
     * - Only relevant transaction data (e.g., income from dividends) is considered in the calculation.
     * - The calculated totals are returned as numerical values for both the current and previous month.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @returns {Promise<{ currentMonthTotal: number, previousMonthTotal: number }>} 
     *   A promise resolving to an object containing the total income for the current and previous month.
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the transaction retrieval or calculation process.
     */
    async getMonthlyTotalIncome(accessToken: string): Promise<{ currentMonthTotal: number, previousMonthTotal: number }> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);

            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Delegate to the repository layer to fetch and calculate monthly income totals.
            // This keeps the service layer clean and separates business logic from data access logic.
            const monthlyTransactionDetails = await this._transactionRepository.getMonthlyTotalIncome(userId);

            // Return the calculated monthly totals to the caller.
            return monthlyTransactionDetails;

        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving monthly transaction totals:', error);

            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves and calculates the total amount of expenses for the current month 
     * for the authenticated user based on their access token.
     *
     * This method ensures:
     * - The user is authenticated via a valid JWT access token.
     * - Only EXPENSE-type transactions are considered.
     * - The total expense amount for the current month is returned.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @returns {Promise<number>} 
     *   A promise resolving to the total expense amount for the current month.
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the transaction retrieval or calculation process.
     */
    async getMonthlyTotalExpense(accessToken: string): Promise<number> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch and calculate monthly expense totals.
            // This keeps the service layer clean and separates business logic from data access logic.
            const totalMonthlyExpense = await this._transactionRepository.getMonthlyTotalExpense(userId);
        
            // Return the calculated monthly expense total to the caller.
            return totalMonthlyExpense;
        
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving monthly expense total:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves and calculates the total amount of expenses for the current month 
     * for the authenticated user based on their access token.
     *
     * This method ensures:
     * - The user is authenticated via a valid JWT access token.
     * - Only EXPENSE-type transactions are considered.
     * - The total expense amount for the current month is returned.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @returns {Promise<number>} 
     *   A promise resolving to the total expense amount for the current month.
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the transaction retrieval or calculation process.
     */
    async getCategoryWiseExpense(accessToken: string): Promise<{category: string, value: number}[]> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch and calculate monthly expense totals.
            // This keeps the service layer clean and separates business logic from data access logic.
            const categoryWiseExpenses = await this._transactionRepository.getCategoryWiseExpense(userId);
        
            // Return the calculated monthly expense total to the caller.
            return categoryWiseExpenses;
        
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving monthly expense total:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }
}

export default TransactionService;
