import { InvestmentModel } from 'model/investments/model/InvestmentModel';
import IInvestmentManagementRepository from './interfaces/IInvestmentManagementRepository';

class InvestmentManagementRepository implements IInvestmentManagementRepository {

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
            const result = await InvestmentModel.findOneAndDelete({ _id: accountId }, { new: true });

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
}

export default InvestmentManagementRepository;
