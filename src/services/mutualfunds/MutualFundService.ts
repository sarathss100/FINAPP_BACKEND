import { ServerError } from '../../error/AppError';
import IMutualFundService from './interfaces/IMutualFundService';
import IMutualFundRepository from '../../repositories/mutualfunds/interfaces/IMutualFundRepository';
import fetchNavData from '../../utils/mutualfunds/navFetcher';
import { ErrorMessages } from '../../constants/errorMessages';
import MutualFundRepository from '../../repositories/mutualfunds/MutualFundRepository';
import { IMutualFundDTO } from '../../dtos/mutualfunds/MutualFundDTO';

/**
 * Service class for managing accounts, including creating, updating, deleting, and retrieving accounts.
 * This class interacts with the account repository to perform database operations.
 */
class MutualFundService implements IMutualFundService {
    private static _instance: MutualFundService;
    private _mutualFundRepository: IMutualFundRepository;

    /**
     * Constructs a new instance of the AccountsService.
     * 
     * @param {IAccountsManagementRepository} accountRepository - The repository used for interacting with account data.
     */
    constructor(mutualFundRepository: IMutualFundRepository) {
        this._mutualFundRepository = mutualFundRepository;
    }

    public static get instance(): MutualFundService {
        if (!MutualFundService._instance) {
            const repo = MutualFundRepository.instance;
            MutualFundService._instance = new MutualFundService(repo);
        }
        return MutualFundService._instance;
    }

    /**
     * Synchronizes the latest NAV (Net Asset Value) data for mutual funds.
     * 
     * @returns {Promise<boolean>} - A promise resolving to true if the synchronization was successful, false otherwise.
     * @throws {Error} - Throws an error if fetching or saving the NAV data fails.
     */
    async syncNavData(): Promise<boolean> {
        try {
            const navData = await fetchNavData();
            if (navData.length < 1) {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_NAV_DATA);
            }

            // Call the repository to synchronize the NAV data.
            const isNavDataSynched = await this._mutualFundRepository.syncBulkMutualFund(navData);

            return isNavDataSynched;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error synchronizing NAV data:', error);
            throw error instanceof Error
                ? error
                : new Error((error as Error).message || 'Unknown error occurred');
        }
    }

    /**
     * Searches for mutual fund records based on a search query.
     *
     * This method delegates the search operation to the repository layer,
     * where the query is matched against scheme names or codes in the database.
     *
     * @param {string} query - The search term used to find matching mutual funds.
     * @returns {Promise<IMutualFundDTO[]>} - A promise resolving to an array of matching mutual fund DTOs.
     * @throws {Error} - Throws an error if the search operation fails at the repository level.
     */
    async searchMutualFunds(query: string): Promise<IMutualFundDTO[]> {
        try {
            // Call the repository to perform the search.
            const mutualFunds = await this._mutualFundRepository.searchMutualFunds(query);
            
            return mutualFunds;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error during mutual fund search:', error);
            throw error instanceof Error
                ? error
                : new Error((error as Error).message || 'Unknown error occurred');
        }
    }

    /**
     * Retrieves detailed information about a specific mutual fund by its scheme code.
     *
     * This method delegates the data-fetching operation to the repository layer,
     * which retrieves a single mutual fund record by matching the provided `schemeCode`.
     *
     * @param {string} schemeCode - The unique identifier (scheme code) of the mutual fund.
     * @returns {Promise<IMutualFundDTO>} - A promise resolving to the matching mutual fund DTO.
     * @throws {Error} - Throws an error if no mutual fund is found or if the repository layer encounters an issue.
     */
    async getMutualFundDetails(schemeCode: string): Promise<IMutualFundDTO> {
        try {
            // Call the repository to fetch mutual fund details by scheme code.
            const mutualFundDetails = await this._mutualFundRepository.getMutualFundDetails(schemeCode);
            
            return mutualFundDetails;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller with proper typing.
            console.error('Error during mutual fund detail retrieval:', error);
            throw error instanceof Error
                ? error
                : new Error((error as Error).message || 'Unknown error occurred');
        }
    }
}

export default MutualFundService;
