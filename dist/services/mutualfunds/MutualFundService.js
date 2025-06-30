"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("error/AppError");
const navFetcher_1 = __importDefault(require("utils/mutualfunds/navFetcher"));
const errorMessages_1 = require("constants/errorMessages");
const MutualFundRepository_1 = __importDefault(require("repositories/mutualfunds/MutualFundRepository"));
/**
 * Service class for managing accounts, including creating, updating, deleting, and retrieving accounts.
 * This class interacts with the account repository to perform database operations.
 */
class MutualFundService {
    /**
     * Constructs a new instance of the AccountsService.
     *
     * @param {IAccountsManagementRepository} accountRepository - The repository used for interacting with account data.
     */
    constructor(mutualFundRepository) {
        this._mutualFundRepository = mutualFundRepository;
    }
    static get instance() {
        if (!MutualFundService._instance) {
            const repo = MutualFundRepository_1.default.instance;
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
    syncNavData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const navData = yield (0, navFetcher_1.default)();
                if (navData.length < 1) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_FETCH_NAV_DATA);
                }
                // Call the repository to synchronize the NAV data.
                const isNavDataSynched = yield this._mutualFundRepository.syncBulkMutualFund(navData);
                return isNavDataSynched;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error synchronizing NAV data:', error);
                throw error instanceof Error
                    ? error
                    : new Error(error.message || 'Unknown error occurred');
            }
        });
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
    searchMutualFunds(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository to perform the search.
                const mutualFunds = yield this._mutualFundRepository.searchMutualFunds(query);
                return mutualFunds;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error during mutual fund search:', error);
                throw error instanceof Error
                    ? error
                    : new Error(error.message || 'Unknown error occurred');
            }
        });
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
    getMutualFundDetails(schemeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository to fetch mutual fund details by scheme code.
                const mutualFundDetails = yield this._mutualFundRepository.getMutualFundDetails(schemeCode);
                return mutualFundDetails;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller with proper typing.
                console.error('Error during mutual fund detail retrieval:', error);
                throw error instanceof Error
                    ? error
                    : new Error(error.message || 'Unknown error occurred');
            }
        });
    }
}
exports.default = MutualFundService;
