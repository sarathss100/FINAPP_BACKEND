import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { IAccountDTO } from 'dtos/accounts/AccountsDTO'; // Make sure this matches your actual export
import IAccountsService from './interfaces/IAccountsService';
import IAccountsManagementRepository from 'repositories/accounts/interfaces/IAccountsManagementRepository';

/**
 * Service class for managing accounts, including creating, updating, deleting, and retrieving accounts.
 * This class interacts with the account repository to perform database operations.
 */
class AccountsService implements IAccountsService {
    private _accountRepository: IAccountsManagementRepository;

    /**
     * Constructs a new instance of the AccountsService.
     * 
     * @param {IAccountsManagementRepository} accountRepository - The repository used for interacting with account data.
     */
    constructor(accountRepository: IAccountsManagementRepository) {
        this._accountRepository = accountRepository;
    }

    /**
     * Creates a new account for the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @param {IAccountDTO} accountData - The data required to create the account.
     * @returns {Promise<IAccountDTO>} - A promise resolving to the created account object.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async addAccount(accessToken: string, accountData: IAccountDTO): Promise<IAccountDTO> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Add user-related metadata (user_id, created_by, last_updated_by) to the account data.
            const enrichedAccountData: IAccountDTO = {
                ...accountData,
                user_id: userId,
                created_by: userId,
                last_updated_by: userId,
            };

            // Call the repository to create the account using the extracted user ID and provided account data.
            const createdAccount = await this._accountRepository.addAccount(enrichedAccountData);

            return createdAccount;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error creating account:', error);
            throw error instanceof Error
                ? error
                : new Error((error as Error).message || 'Unknown error occurred');
        }
    }

    /**
     * Updates an existing account for the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @param {string} accountId - The unique identifier of the account to be updated.
     * @param {Partial<IAccountDTO>} accountData - The partial data to update the account with.
     * @returns {Promise<IAccountDTO>} - A promise resolving to the updated account object.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async updateAccount(accessToken: string, accountId: string, accountData: Partial<IAccountDTO>): Promise<IAccountDTO> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Add user-related metadata (user_id, last_updated_by) to the account data.
           const updatedAccountData = { user_id: userId, last_updated_by: userId, ...accountData };
        
            // Call the repository to update the account using the account ID and provided data.
            const updatedAccount = await this._accountRepository.updateAccount(accountId, updatedAccountData);
        
            return updatedAccount;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error updating Account:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Removes an existing account by its unique identifier.
     * 
     * @param {string} accountId - The unique identifier of the account to be removed.
     * @returns {Promise<boolean>} - A promise resolving to `true` if the account was successfully removed.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async removeAccount(accountId: string): Promise<boolean> {
        try {
            // Call the repository to remove the account using the provided account ID.
            const isRemoved = await this._accountRepository.removeAccount(accountId);

            return isRemoved;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error removing Account:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all accounts associated with the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<IAccountDTO[]>} - A promise resolving to an array of account objects associated with the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getUserAccounts(accessToken: string): Promise<IAccountDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the accounts associated with the extracted user ID.
            const accountDetails = await this._accountRepository.getUserAccounts(userId);

            return accountDetails;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving user accounts:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all accounts associated with the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<IAccountDTO[]>} - A promise resolving to an array of account objects associated with the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getTotalBalance(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the accounts associated with the extracted user ID.
            const accountDetails = await this._accountRepository.getUserAccounts(userId);

            const totalDebt = accountDetails.reduce((sum, account) => {
                if (account.account_type === 'Debt') {
                    sum += (account.current_balance ?? 0);
                }
                return sum;
            }, 0);

            const totalSavings = accountDetails.reduce((sum, account) => {
                if (account.account_type !== 'Debt') {
                    sum += (account.current_balance ?? 0);
                }
                return sum;
            }, 0);


            const totalBalance = totalSavings - totalDebt;

            return totalBalance;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving totalBalance:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates the total balance of all bank accounts associated with the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<number>} - A promise resolving to the total balance of all the user's bank accounts.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws a generic error if the database operation fails or an unexpected error occurs.
     */
    async getTotalBankBalance(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the accounts associated with the extracted user ID.
            const accountDetails = await this._accountRepository.getUserAccounts(userId);

            const totalBankBalance = accountDetails.reduce((sum, account) => {
                if (account.account_type === 'Bank') {
                    sum += (account.current_balance ?? 0);
                }
                return sum;
            }, 0);

            return totalBankBalance;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving total Bank Balance:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates the total debt balance across all debt-type accounts associated with the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<number>} - A promise resolving to the total debt balance of the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws a generic error if the database operation fails or an unexpected error occurs.
     */
    async getTotalDebt(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Call the repository to retrieve the accounts associated with the extracted user ID.
            const accountDetails = await this._accountRepository.getUserAccounts(userId);
        
            const totalDebt = accountDetails.reduce((sum, account) => {
                if (account.account_type === 'Debt') {
                    sum += (account.current_balance ?? 0);
                }
                return sum;
            }, 0);
        
            return totalDebt;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving total debt:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
 * Calculates the total investment balance across all investment-type accounts associated with the authenticated user.
 * 
 * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
 * @returns {Promise<number>} - A promise resolving to the total investment balance of the user.
 * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
 * @throws {Error} - Throws a generic error if the database operation fails or an unexpected error occurs.
 */
async getTotalInvestment(accessToken: string): Promise<number> {
    try {
        // Decode and validate the access token to extract the user ID associated with it.
        const userId = decodeAndValidateToken(accessToken);
        if (!userId) {
            throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
        }

        // Call the repository to retrieve the accounts associated with the extracted user ID.
        const accountDetails = await this._accountRepository.getUserAccounts(userId);

        const totalInvestment = accountDetails.reduce((sum, account) => {
            if (account.account_type === 'Investment') {
                sum += (account.current_balance ?? 0);
            }
            return sum;
        }, 0);

        return totalInvestment;
    } catch (error) {
        // Log and re-throw the error to propagate it to the caller.
        console.error('Error retrieving total investment:', error);
        throw new Error((error as Error).message);
    }
}
}

export default AccountsService;
