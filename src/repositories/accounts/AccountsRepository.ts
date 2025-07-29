import { AccountModel } from '../../model/accounts/model/AccountsModel';
import IAccountDocument from '../../model/accounts/interfaces/IAccounts';
import BaseRepository from '../base_repo/BaseRepository';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import IAccountsRepository from './interfaces/IAccountsRepository';

export default class AccountsRepository implements IAccountsRepository {
    private static _instance: AccountsRepository;
    private baseRepo: IBaseRepository<IAccountDocument> = new BaseRepository<IAccountDocument>(AccountModel);

    public constructor() {};

    public static get instance(): AccountsRepository {
        if (!AccountsRepository._instance) {
            AccountsRepository._instance = new AccountsRepository();
        }
        return AccountsRepository._instance;
    }

    async addAccount(accountData: Partial<IAccountDocument>): Promise<IAccountDocument> {
        try {
            // Check if an account with the same name and number already exists for this user
            const existingAccount = await this.baseRepo.findOne({
                user_id: accountData.user_id,
                account_name: accountData.account_name,
                account_number: accountData.account_number,
            });
    
            if (existingAccount) {
                return existingAccount;
            }
    
            // No duplicate found, proceed to create a new account
            const result = await this.baseRepo.create(accountData);
    
            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateAccount(accountId: string, accountData: Partial<IAccountDocument>): Promise<IAccountDocument> {
        try {
            // Perform the update operation
            const result = await this.baseRepo.updateOne(
                { _id: accountId }, 
                { ...accountData }, 
            );

            // Handle case where no account is found
            if (!result) {
                throw new Error('Account not found');
            }

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async removeAccount(accountId: string): Promise<IAccountDocument> {
        try {
            // Perform the deletion operation
            const result = await this.baseRepo.deleteOne({ _id: accountId });

            // Handle case where no account is found
            if (!result) {
                throw new Error('Account not found');
            }

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUserAccounts(userId: string): Promise<IAccountDocument[]> {
        try {
            // Query the database to retrieve all accounts associated with the given `userId`.
            const results = await this.baseRepo.find({ user_id: userId });

            // it means no accounts were found for the given user, and an error is thrown.
            if (!results || results.length === 0) {
                throw new Error('No accounts found for the specified user');
            }

            return results;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
