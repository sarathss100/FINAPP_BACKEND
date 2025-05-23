// import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
// import { AuthenticationError } from 'error/AppError';
// import { ErrorMessages } from 'constants/errorMessages';
// import { StatusCodes } from 'constants/statusCodes';
import IInvestmentService from './interfaces/IInvestmentService';
import InvestmentManagementRepository from 'repositories/investments/InvestmentManagementRepository';

/**
 * Service class for managing accounts, including creating, updating, deleting, and retrieving accounts.
 * This class interacts with the account repository to perform database operations.
 */
class InvestmentService implements IInvestmentService {
    private _investmentRepository: InvestmentManagementRepository;

    /**
     * Constructs a new instance of the AccountsService.
     * 
     * @param {IAccountsManagementRepository} accountRepository - The repository used for interacting with account data.
     */
    constructor(investmentRepository: InvestmentManagementRepository) {
        this._investmentRepository = investmentRepository;
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
            const isRemoved = await this._investmentRepository.removeAccount(accountId);

            return isRemoved;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error removing Account:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default InvestmentService;
