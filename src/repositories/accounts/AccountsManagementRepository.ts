import { IAccountDTO } from 'dtos/accounts/AccountsDTO';
import IAccountsManagementRepository from './interfaces/IAccountsManagementRepository';
import { AccountModel } from 'model/accounts/model/AccountsModel';


class AccountManagementRepository implements IAccountsManagementRepository {
    /**
     * Creates a new financial account in the database and returns the created account in `AccountDTO` format.
     * 
     * This method accepts an `accountData` object conforming to the `AccountDTO` structure. Based on the account type
     * (e.g., Bank, Investment, Cash, or Debt), it dynamically selects the appropriate Mongoose model (using discriminators)
     * and inserts the data into the database. The result is converted to a plain JavaScript object for consistency.
     *
     * If the account type is not recognized, an error is thrown.
     *
     * @param {AccountDTO} accountData - The input data representing the account to be created. Must conform to the `AccountDTO` structure.
     * @returns {Promise<AccountDTO>} A promise resolving to the created account in `AccountDTO` format.
     * @throws {Error} Throws an error if:
     * - The account type is unknown
     * - The database operation fails
     * - Invalid data is provided
     */
    async addAccount(accountData: IAccountDTO): Promise<IAccountDTO> { 
        try {
            const result = await AccountModel.create(accountData);
            const addedAccount: IAccountDTO = {
                _id: result?._id?.toString(),
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

            return addedAccount;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }


    /**
    * Updates an existing account in the database and returns the updated account in IAccountDTO format.
    * 
    * This method takes an input object (`accountData`) containing updated account details, finds the account by `user_id`,
    * and updates it in the database using the `AccountsModel`. The updated result is mapped to the `IAccountDTO` format,
    * with MongoDB ObjectIds converted to strings for consistency.
    * 
     * @param {IAccountDTO} accountData - The input data representing the account to be updated. Must include `user_id` to identify the account.
    * @returns {Promise<IAccountDTO>} - A promise resolving to the updated account in IAccountsDTO format, with ObjectIds converted to strings.
    * @throws {Error} - Throws an error if the database operation fails, the account is not found, or invalid data is provided.
    */
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

    /**
    * Removes an existing account from the database.
    * 
    * @param {string} accountId - The unique identifier of the account to be removed.
    * @returns {Promise<boolean>} - A promise resolving to `true` if the account was successfully removed.
    * @throws {Error} - Throws an error if the database operation fails or the account is not found.
    */
    async removeAccount(accountId: string): Promise<boolean> {
        try {
            // Perform the deletion operation
            const result = await AccountModel.findOneAndDelete({ _id: accountId }, { new: true });

            // Handle case where no account is found
            if (!result) {
                throw new Error('Account not found');
            }

            return true;
        } catch (error) {
            console.error('Error updating Account:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all accounts associated with a specific user from the database.
     * 
     * @param {string} userId - The unique identifier of the user whose accounts are being retrieved.
     * @returns {Promise<IAccountDTO[]>} - A promise resolving to an array of `IAccountDTO` objects representing the user's accounts.
     * @throws {Error} - Throws an error if the database operation fails or no accounts are found for the given user.
     */
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
