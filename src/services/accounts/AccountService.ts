import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { IAccountDTO } from 'dtos/accounts/AccountsDTO';
import IAccountsService from './interfaces/IAccountsService';
import IAccountsManagementRepository from 'repositories/accounts/interfaces/IAccountsManagementRepository';
import AccountManagementRepository from 'repositories/accounts/AccountsManagementRepository';
import { eventBus } from 'events/eventBus';

class AccountsService implements IAccountsService {
    private static _instance: AccountsService;
    private _accountRepository: IAccountsManagementRepository;

    constructor(accountRepository: IAccountsManagementRepository) {
        this._accountRepository = accountRepository;
    }

    public static get instance(): AccountsService {
        if (!AccountsService._instance) {
            const repo = AccountManagementRepository.instance;
            AccountsService._instance = new AccountsService(repo);
        }
        return AccountsService._instance;
    }

    // Creates a new account for the authenticated user.
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

            // Emit socket event to notify user about new notification
            eventBus.emit('account_created', createdAccount);

            return createdAccount;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error creating account:', error);
            throw error instanceof Error
                ? error
                : new Error((error as Error).message || 'Unknown error occurred');
        }
    }

    // Updates an existing account for the authenticated user.
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

            // Emit socket event to notify user about new notification
            eventBus.emit('account_updated', updatedAccount);
        
            return updatedAccount;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error updating Account:', error);
            throw new Error((error as Error).message);
        }
    }

    // Removes an existing account by its unique identifier.
    async removeAccount(accountId: string): Promise<boolean> {
        try {
            // Call the repository to remove the account using the provided account ID.
            const removedAccountDetails = await this._accountRepository.removeAccount(accountId);

            // Emit socket event to notify user about new notification
            eventBus.emit('account_removed', removedAccountDetails);

            return removedAccountDetails._id ? true : false;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error removing Account:', error);
            throw new Error((error as Error).message);
        }
    }

    // Retrieves all accounts associated with the authenticated user.
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

    // Retrieves all accounts associated with the authenticated user.
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

    // Calculates the total balance of all bank accounts associated with the authenticated user.
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

    // Calculates the total debt balance across all debt-type accounts associated with the authenticated user.
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

    // Calculates the total investment balance across all investment-type accounts associated with the authenticated user.
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
