import { IAccountDTO } from 'dtos/accounts/AccountsDTO';
import IAccountsManagementRepository from './interfaces/IAccountsManagementRepository';
import { AccountModel } from 'model/accounts/model/AccountsModel';

class AccountManagementRepository implements IAccountsManagementRepository {
    private static _instance: AccountManagementRepository;

    public constructor() {};

    public static get instance(): AccountManagementRepository {
        if (!AccountManagementRepository._instance) {
            AccountManagementRepository._instance = new AccountManagementRepository();
        }
        return AccountManagementRepository._instance;
    }

    // Creates a new financial account in the database and returns the created account in `AccountDTO` format.
    async addAccount(accountData: IAccountDTO): Promise<IAccountDTO> {
        try {
            // Check if an account with the same name and number already exists for this user
            const existingAccount = await AccountModel.findOne({
                account_name: accountData.account_name,
                account_number: accountData.account_number,
                user_id: accountData.user_id
            });
    
            if (existingAccount) {
                // Return the existing account instead of throwing error
                return {
                    _id: existingAccount._id?.toString(),
                    user_id: existingAccount.user_id?.toString(),
                    account_name: existingAccount.account_name,
                    currency: existingAccount.currency,
                    description: existingAccount.description,
                    is_active: existingAccount.is_active,
                    created_by: existingAccount.created_by.toString(),
                    last_updated_by: existingAccount.last_updated_by?.toString(),
                    account_type: existingAccount.account_type,
                    current_balance: existingAccount.current_balance,
                    institution: existingAccount.institution,
                    account_number: existingAccount.account_number,
                    account_subtype: existingAccount.account_subtype,
                    loan_type: existingAccount.loan_type,
                    interest_rate: existingAccount.interest_rate,
                    monthly_payment: existingAccount.monthly_payment,
                    due_date: existingAccount.due_date,
                    term_months: existingAccount.term_months,
                    investment_platform: existingAccount.investment_platform,
                    portfolio_value: existingAccount.portfolio_value,
                    location: existingAccount.location
                };
            }
    
            // No duplicate found, proceed to create a new account
            const result = await AccountModel.create(accountData);
    
            // Return the newly created account
            const addedAccount: IAccountDTO = {
                _id: result._id?.toString(),
                user_id: result.user_id?.toString(),
                account_name: result.account_name,
                currency: result.currency,
                description: result.description,
                is_active: result.is_active,
                created_by: result.created_by.toString(),
                last_updated_by: result.last_updated_by?.toString(),
                account_type: result.account_type,
                current_balance: result.current_balance,
                institution: result.institution,
                account_number: result.account_number,
                account_subtype: result.account_subtype,
                loan_type: result.loan_type,
                interest_rate: result.interest_rate,
                monthly_payment: result.monthly_payment,
                due_date: result.due_date,
                term_months: result.term_months,
                investment_platform: result.investment_platform,
                portfolio_value: result.portfolio_value,
                location: result.location
            };
    
            return addedAccount;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    // Updates an existing account in the database and returns the updated account in IAccountDTO format.
    async updateAccount(accountId: string, accountData: Partial<IAccountDTO>): Promise<IAccountDTO> {
        try {
            // Perform the update operation
            const result = await AccountModel.findOneAndUpdate(
                { _id: accountId }, 
                { ...accountData }, 
                { new: true }   
            );

            // Handle case where no account is found
            if (!result) {
                throw new Error('Account not found');
            }

            // Map the updated result to IAccountDTO format
            const updatedAccount: IAccountDTO = {
                _id: result._id?.toString(),
                user_id: result?.user_id?.toString(),
                account_name: result.account_name,
                currency: result.currency,
                description: result.description,
                is_active: result.is_active,
                created_by: result.created_by.toString(),
                last_updated_by: result.last_updated_by?.toString(),
                account_type: result.account_type,
                current_balance: result.current_balance,
                institution: result.institution,
                account_number: result.account_number,
                account_subtype: result.account_subtype,
                loan_type: result.loan_type,
                interest_rate: result.interest_rate,
                monthly_payment: result.monthly_payment,
                due_date: result.due_date,
                term_months: result.term_months,
                investment_platform: result.investment_platform,
                portfolio_value: result.portfolio_value,
                location: result.location
            }

            return updatedAccount;
        } catch (error) {
            console.error('Error updating Account:', error);
            throw new Error((error as Error).message);
        }
    }

    // Removes an existing account from the database.
    async removeAccount(accountId: string): Promise<IAccountDTO> {
        try {
            // Perform the deletion operation
            const result = await AccountModel.findOneAndDelete({ _id: accountId }, { new: true });

            // Handle case where no account is found
            if (!result) {
                throw new Error('Account not found');
            }

            // Map the removed result to IAccountDTO format
            const removedAccount: IAccountDTO = {
                _id: result._id?.toString(),
                user_id: result?.user_id?.toString(),
                account_name: result.account_name,
                currency: result.currency,
                description: result.description,
                is_active: result.is_active,
                created_by: result.created_by.toString(),
                last_updated_by: result.last_updated_by?.toString(),
                account_type: result.account_type,
                current_balance: result.current_balance,
                institution: result.institution,
                account_number: result.account_number,
                account_subtype: result.account_subtype,
                loan_type: result.loan_type,
                interest_rate: result.interest_rate,
                monthly_payment: result.monthly_payment,
                due_date: result.due_date,
                term_months: result.term_months,
                investment_platform: result.investment_platform,
                portfolio_value: result.portfolio_value,
                location: result.location
            }

            return removedAccount;
        } catch (error) {
            console.error('Error updating Account:', error);
            throw new Error((error as Error).message);
        }
    }

    //Retrieves all accounts associated with a specific user from the database.
    async getUserAccounts(userId: string): Promise<IAccountDTO[]> {
        try {
            // Query the database to retrieve all accounts associated with the given `userId`.
            const result = await AccountModel.find<IAccountDTO>({ user_id: userId });

            // it means no accounts were found for the given user, and an error is thrown.
            if (!result || result.length === 0) {
                throw new Error('No accounts found for the specified user');
            }

            // Return the retrieved accounts as an array of `IAccountDTO` objects.
            return result;
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving account details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }
}

export default AccountManagementRepository;
