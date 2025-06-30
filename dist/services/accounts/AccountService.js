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
Object.defineProperty(exports, "__esModule", { value: true });
const tokenUtils_1 = require("utils/auth/tokenUtils");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
/**
 * Service class for managing accounts, including creating, updating, deleting, and retrieving accounts.
 * This class interacts with the account repository to perform database operations.
 */
class AccountsService {
    /**
     * Constructs a new instance of the AccountsService.
     *
     * @param {IAccountsManagementRepository} accountRepository - The repository used for interacting with account data.
     */
    constructor(accountRepository) {
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
    addAccount(accessToken, accountData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Add user-related metadata (user_id, created_by, last_updated_by) to the account data.
                const enrichedAccountData = Object.assign(Object.assign({}, accountData), { user_id: userId, created_by: userId, last_updated_by: userId });
                // Call the repository to create the account using the extracted user ID and provided account data.
                const createdAccount = yield this._accountRepository.addAccount(enrichedAccountData);
                return createdAccount;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error creating account:', error);
                throw error instanceof Error
                    ? error
                    : new Error(error.message || 'Unknown error occurred');
            }
        });
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
    updateAccount(accessToken, accountId, accountData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Add user-related metadata (user_id, last_updated_by) to the account data.
                const updatedAccountData = Object.assign({ user_id: userId, last_updated_by: userId }, accountData);
                // Call the repository to update the account using the account ID and provided data.
                const updatedAccount = yield this._accountRepository.updateAccount(accountId, updatedAccountData);
                return updatedAccount;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error updating Account:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Removes an existing account by its unique identifier.
     *
     * @param {string} accountId - The unique identifier of the account to be removed.
     * @returns {Promise<boolean>} - A promise resolving to `true` if the account was successfully removed.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    removeAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository to remove the account using the provided account ID.
                const isRemoved = yield this._accountRepository.removeAccount(accountId);
                return isRemoved;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error removing Account:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves all accounts associated with the authenticated user.
     *
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<IAccountDTO[]>} - A promise resolving to an array of account objects associated with the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    getUserAccounts(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the accounts associated with the extracted user ID.
                const accountDetails = yield this._accountRepository.getUserAccounts(userId);
                return accountDetails;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving user accounts:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves all accounts associated with the authenticated user.
     *
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<IAccountDTO[]>} - A promise resolving to an array of account objects associated with the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    getTotalBalance(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the accounts associated with the extracted user ID.
                const accountDetails = yield this._accountRepository.getUserAccounts(userId);
                const totalDebt = accountDetails.reduce((sum, account) => {
                    var _a;
                    if (account.account_type === 'Debt') {
                        sum += ((_a = account.current_balance) !== null && _a !== void 0 ? _a : 0);
                    }
                    return sum;
                }, 0);
                const totalSavings = accountDetails.reduce((sum, account) => {
                    var _a;
                    if (account.account_type !== 'Debt') {
                        sum += ((_a = account.current_balance) !== null && _a !== void 0 ? _a : 0);
                    }
                    return sum;
                }, 0);
                const totalBalance = totalSavings - totalDebt;
                return totalBalance;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving totalBalance:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Calculates the total balance of all bank accounts associated with the authenticated user.
     *
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<number>} - A promise resolving to the total balance of all the user's bank accounts.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws a generic error if the database operation fails or an unexpected error occurs.
     */
    getTotalBankBalance(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the accounts associated with the extracted user ID.
                const accountDetails = yield this._accountRepository.getUserAccounts(userId);
                const totalBankBalance = accountDetails.reduce((sum, account) => {
                    var _a;
                    if (account.account_type === 'Bank') {
                        sum += ((_a = account.current_balance) !== null && _a !== void 0 ? _a : 0);
                    }
                    return sum;
                }, 0);
                return totalBankBalance;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving total Bank Balance:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Calculates the total debt balance across all debt-type accounts associated with the authenticated user.
     *
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<number>} - A promise resolving to the total debt balance of the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws a generic error if the database operation fails or an unexpected error occurs.
     */
    getTotalDebt(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the accounts associated with the extracted user ID.
                const accountDetails = yield this._accountRepository.getUserAccounts(userId);
                const totalDebt = accountDetails.reduce((sum, account) => {
                    var _a;
                    if (account.account_type === 'Debt') {
                        sum += ((_a = account.current_balance) !== null && _a !== void 0 ? _a : 0);
                    }
                    return sum;
                }, 0);
                return totalDebt;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving total debt:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
 * Calculates the total investment balance across all investment-type accounts associated with the authenticated user.
 *
 * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
 * @returns {Promise<number>} - A promise resolving to the total investment balance of the user.
 * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
 * @throws {Error} - Throws a generic error if the database operation fails or an unexpected error occurs.
 */
    getTotalInvestment(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the accounts associated with the extracted user ID.
                const accountDetails = yield this._accountRepository.getUserAccounts(userId);
                const totalInvestment = accountDetails.reduce((sum, account) => {
                    var _a;
                    if (account.account_type === 'Investment') {
                        sum += ((_a = account.current_balance) !== null && _a !== void 0 ? _a : 0);
                    }
                    return sum;
                }, 0);
                return totalInvestment;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving total investment:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = AccountsService;
