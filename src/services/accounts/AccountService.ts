import { IAccountDTO } from '../../dtos/accounts/AccountsDTO';
import IAccountsService from './interfaces/IAccountsService';
import IAccountsManagementRepository from '../../repositories/accounts/interfaces/IAccountsManagementRepository';
import AccountManagementRepository from '../../repositories/accounts/AccountsManagementRepository';
import { eventBus } from '../../events/eventBus';
import AccountMapper from '../../mappers/accounts/AccountsMapper';
import { extractUserIdFromToken, wrapServiceError } from '../../utils/serviceUtils';

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

    async addAccount(accessToken: string, accountData: IAccountDTO): Promise<IAccountDTO> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Add user-related metadata (user_id, created_by, last_updated_by) to the account data.
            const enrichedAccountData: IAccountDTO = {
                ...accountData,
                user_id: userId,
                created_by: userId,
                last_updated_by: userId,
            };

            // map the IAccountDTO to Match IAccountDocument
            const mappedData = AccountMapper.toModel(enrichedAccountData);

            // Call the repository to create the account using the extracted user ID and provided account data.
            const createdAccount = await this._accountRepository.addAccount(mappedData);

            const resultDTO = AccountMapper.toDTO(createdAccount);

            // Emit socket event to notify user about new notification
            eventBus.emit('account_created', resultDTO);

            return resultDTO;
        } catch (error) {
            console.error('Error creating account:', error);
            throw wrapServiceError(error);
        }
    }

    async updateAccount(accessToken: string, accountId: string, accountData: Partial<IAccountDTO>): Promise<IAccountDTO> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Add user-related metadata (user_id, last_updated_by) to the account data.
           const updatedAccountData = { user_id: userId, last_updated_by: userId, ...accountData };

            // map the IAccountDTO to Match IAccountDocument
            const mappedData = AccountMapper.toModel(updatedAccountData);
        
            // Call the repository to update the account using the account ID and provided data.
            const updatedAccount = await this._accountRepository.updateAccount(accountId, mappedData);

            const resultDTO = AccountMapper.toDTO(updatedAccount);

            // Emit socket event to notify user about new notification
            eventBus.emit('account_updated', resultDTO);
        
            return resultDTO;
        } catch (error) {
            console.error('Error updating Account:', error);
            throw wrapServiceError(error);
        }
    }

    async removeAccount(accountId: string): Promise<boolean> {
        try {
            const removedAccountDetails = await this._accountRepository.removeAccount(accountId);

            // Emit socket event to notify user about new notification
            eventBus.emit('account_removed', removedAccountDetails);

            return removedAccountDetails._id ? true : false;
        } catch (error) {
            console.error('Error removing Account:', error);
            throw wrapServiceError(error);
        }
    }

    async getUserAccounts(accessToken: string): Promise<IAccountDTO[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Call the repository to retrieve the accounts associated with the extracted user ID.
            const accountDetails = await this._accountRepository.getUserAccounts(userId);

            const resultDTO = AccountMapper.toDTOs(accountDetails);

            return resultDTO;
        } catch (error) {
            console.error('Error retrieving user accounts:', error);
            throw wrapServiceError(error);
        }
    }

    async getTotalBalance(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);

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
            console.error('Error retrieving totalBalance:', error);
            throw wrapServiceError(error);
        }
    }

    async getTotalBankBalance(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);

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
            console.error('Error retrieving total Bank Balance:', error);
            throw wrapServiceError(error);
        }
    }

    async getTotalDebt(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
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
            console.error('Error retrieving total debt:', error);
            throw wrapServiceError(error);
        }
    }

    async getTotalInvestment(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);

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
            console.error('Error retrieving total investment:', error);
            throw wrapServiceError(error);
        }
    }
}

export default AccountsService;
