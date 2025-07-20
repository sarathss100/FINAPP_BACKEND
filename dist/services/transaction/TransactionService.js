"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const tokenUtils_1 = require("utils/auth/tokenUtils");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const Papa = __importStar(require("papaparse"));
const XLSX = __importStar(require("xlsx"));
const extractTransactionTable_1 = require("utils/transaction/extractTransactionTable");
const normalizeTransaction_1 = require("utils/transaction/normalizeTransaction");
const crypto_1 = __importDefault(require("crypto"));
const classifyTransaction_1 = require("utils/transaction/classifyTransaction");
const TransactionRepository_1 = __importDefault(require("repositories/transaction/TransactionRepository"));
const eventBus_1 = require("events/eventBus");
class TransactionService {
    constructor(transactionRepository) {
        this._transactionRepository = transactionRepository;
    }
    static get instance() {
        if (!TransactionService._instance) {
            const repo = TransactionRepository_1.default.instance;
            TransactionService._instance = new TransactionService(repo);
        }
        return TransactionService._instance;
    }
    /**
     * Normalizes a date string to ensure consistent format for hash generation
     * Handles different date input formats and types
     */
    normalizeDate(date) {
        if (date instanceof Date) {
            // Convert Date object to ISO string format YYYY-MM-DD
            return date.toISOString().split('T')[0];
        }
        else if (typeof date === 'string') {
            // Try to parse the string as a date and normalize it
            try {
                const dateObj = new Date(date);
                if (!isNaN(dateObj.getTime())) {
                    return dateObj.toISOString().split('T')[0];
                }
            }
            catch (e) {
                // If parsing fails, just use the trimmed string
                console.error(e.message);
            }
            return date.trim();
        }
        return String(date).trim();
    }
    // Generates a unique hash for a transaction based on date, description, and amount
    generateHash(date, description, amount) {
        const input = `${date.trim()}|${description.trim()}|${amount.toFixed(2)}`;
        return crypto_1.default.createHash('sha1').update(input).digest('hex');
    }
    /**
     * Record transaction(s) for the authenticated user, either single transaction or bulk.
     * Prevents duplicate transactions by checking transaction hash.
     */
    createTransaction(accessToken, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Handle whether data is a single transaction or an array
                if (Array.isArray(data)) {
                    // Process bulk transactions
                    const response = yield this.processBulkTransactions(userId, data);
                    // Emit socket event to notify user about transaction Creation
                    eventBus_1.eventBus.emit('transaction_created', userId);
                    return response;
                }
                else {
                    // Process single transaction
                    const response = yield this.processSingleTransaction(userId, data);
                    // Emit socket event to notify user about transaction Creation
                    eventBus_1.eventBus.emit('transaction_created', userId);
                    return response;
                }
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller
                console.error('Error creating transaction:', error);
                throw new Error(error.message);
            }
        });
    }
    // Process a single transaction with hash checking
    processSingleTransaction(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Normalize date and handle potential undefined description
                const normalizedDate = this.normalizeDate(data.date);
                const description = data.description || '';
                // Generate hash for the transaction
                const transactionHash = this.generateHash(normalizedDate, description, data.amount);
                // Check if a transaction with this hash already exists for this user
                const existingTransaction = yield this._transactionRepository.getExistingTransaction(userId, transactionHash);
                if (existingTransaction) {
                    throw new Error(`Transaction with hash ${transactionHash} already exists. Skipping insertion.`);
                }
                // Add user ID and hash to transaction data
                const transactionData = Object.assign(Object.assign({}, data), { user_id: userId, transactionHash: transactionHash });
                // Create the transaction
                return yield this._transactionRepository.createTransaction(transactionData);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    /**
    * Process multiple transactions with hash checking
    * More efficient implementation that:
    * 1. Pre-computes all hashes
    * 2. Performs a single bulk database query for all existing hashes
    * 3. Processes only the new transactions in batch
    *
    * @param {string} userId - User ID from decoded token
    * @param {ITransactionDTO[]} dataArray - Array of transaction data
    * @returns {Promise<ITransactionDTO[]>} - Array of created transactions
    */
    processBulkTransactions(userId, dataArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            // Pre-compute hashes for all transactions and add userId
            const transactionsWithHash = dataArray.map(data => {
                // Normalize date format and handle potential undefined description
                const normalizedDate = this.normalizeDate(data.date);
                const description = data.description || '';
                const transactionHash = this.generateHash(normalizedDate, description, data.amount);
                const { category, type } = (0, classifyTransaction_1.classifyTransaction)(description);
                return Object.assign(Object.assign({}, data), { user_id: userId, transactionHash,
                    category,
                    type });
            });
            // Extract all hashes for bulk query
            const allHashes = transactionsWithHash.map(t => t.transactionHash);
            // Find all existing transactions in a single query
            const existingTransactions = (yield this._transactionRepository.getExistingTransactions(allHashes)) || [];
            // Create a Set of existing hashes
            const existingHashSet = new Set(existingTransactions.map(t => t.transactionHash));
            // Add existing transactions to results
            for (const existingTx of existingTransactions) {
                console.log(`Transaction with hash ${existingTx.transactionHash} already exists. Skipping insertion.`);
                results.push(existingTx);
            }
            // Filter out only new transactions that don't exist in the database
            const newTransactions = transactionsWithHash.filter(t => !existingHashSet.has(t.transactionHash));
            if (newTransactions.length > 0) {
                // Bulk create all new transactions at once if there are any
                const createdTransactions = yield this._transactionRepository.createBulkTransactions(newTransactions);
                results.push(...createdTransactions);
            }
            return results;
        });
    }
    /**
     * Retrieves all transactions associated with the authenticated user.
     */
    getUserTransactions(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the transaction associated with the extracted user ID.
                const transactionDetails = yield this._transactionRepository.getUserTransactions(userId);
                return transactionDetails;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving user transaction:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Calculates and returns the total income for the current and previous month
     * for the authenticated user based on their access token.
     */
    getMonthlyTotalIncome(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch and calculate monthly income totals.
                // This keeps the service layer clean and separates business logic from data access logic.
                const monthlyTransactionDetails = yield this._transactionRepository.getMonthlyTotalIncome(userId);
                // Return the calculated monthly totals to the caller.
                return monthlyTransactionDetails;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving monthly transaction totals:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    /**
     * Calculates and returns the total income for the latest week
     * for the authenticated user based on their access token.
     */
    getWeeklyTotalIncome(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Fetch the weekly income total from the repository layer.
                const weeklyTotalIncome = yield this._transactionRepository.getWeeklyTotalIncome(userId);
                // Return the calculated weekly income total.
                return weeklyTotalIncome;
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error retrieving weekly income:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves and calculates the total amount of expenses for the current month
     * for the authenticated user based on their access token.
     */
    getMonthlyTotalExpense(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch and calculate monthly expense totals.
                // This keeps the service layer clean and separates business logic from data access logic.
                const totalMonthlyExpense = yield this._transactionRepository.getMonthlyTotalExpense(userId);
                // Return the calculated monthly expense total to the caller.
                return totalMonthlyExpense;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving monthly expense total:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves and calculates the total amount of expenses for the current month
     * for the authenticated user based on their access token.
     */
    getCategoryWiseExpense(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch and calculate monthly expense totals.
                // This keeps the service layer clean and separates business logic from data access logic.
                const categoryWiseExpenses = yield this._transactionRepository.getCategoryWiseExpense(userId);
                // Return the calculated monthly expense total to the caller.
                return categoryWiseExpenses;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving monthly expense total:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    /**
     * Extracts and processes transaction data from an uploaded file (CSV or Excel).
     * Converts the file into a standardized array of parsed transactions.
     */
    extractTransactionData(file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const fileExtension = ((_a = file.originalname.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
                let csvData;
                const buffer = file.buffer;
                if (fileExtension === 'csv') {
                    csvData = buffer.toString('utf8');
                }
                else if (['xlsx', 'xls', 'xlsm'].includes(fileExtension)) {
                    const workbook = XLSX.read(buffer, { type: 'buffer' });
                    const firstSheetName = workbook.SheetNames[0];
                    csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);
                }
                else {
                    throw new Error(`Unsupported file format.`);
                }
                // This is the first layer of data extraction 
                const extractedTransactionTable = yield (0, extractTransactionTable_1.extractTransactionTable)(csvData);
                // This is the second layer of data extraction
                const processCSVData = this.processCSVData(extractedTransactionTable);
                // This is the third layer of data extraction 
                const normalizedData = Array.isArray(processCSVData)
                    ? processCSVData.map(item => (0, normalizeTransaction_1.normalizeTransactionObject)(item))
                    : [];
                // This is the final layer of data extraction - filtering credit and debit fields
                const transactions = normalizedData.map(transaction => {
                    const filteredTransaction = Object.assign({}, transaction);
                    // For income transactions, ensure debit is always 0
                    if (filteredTransaction.transaction_type === 'income') {
                        filteredTransaction.debit_amount = 0;
                    }
                    // For expense transactions, ensure credit is always 0 (or negative as per your data model)
                    if (filteredTransaction.transaction_type === 'expense') {
                        filteredTransaction.credit_amount = 0;
                    }
                    return filteredTransaction;
                });
                return transactions;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error extracting transaction data:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    // function to process CSV data using Papa Parse
    processCSVData(csvData) {
        const result = [];
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                result.push(...results.data);
            },
            error: function (error) {
                throw new Error(`Error parsing CSV: ${error.message}`);
            },
        });
        return result;
    }
    ;
    /**
     * Retrieves all INCOME-type transactions for the authenticated user
     * for the current year based on their access token.
     */
    getAllIncomeTransactionsByCategory(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch income transactions for the current year.
                // This keeps the service layer clean and separates business logic from data access logic.
                const transactions = yield this._transactionRepository.getAllIncomeTransactionsByCategory(userId);
                // Return the retrieved transactions
                return transactions;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving income transactions:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves all EXPENSE-type transactions grouped by category for the authenticated user
     * for the current year based on their access token.
     */
    getAllExpenseTransactionsByCategory(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch expense transactions grouped by category.
                // This keeps the service layer clean and separates business logic from data access logic.
                const transactions = yield this._transactionRepository.getAllExpenseTransactionsByCategory(userId);
                // Return the retrieved expense transactions grouped by category
                return transactions;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving expense transactions by category:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    // Retrieves month-wise income data for the current year for the authenticated user.
    getMonthlyIncomeForChart(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch month-wise income data.
                // This keeps the service layer clean and separates business logic from data access logic.
                const transactions = yield this._transactionRepository.getMonthlyIncomeForChart(userId);
                // Return the retrieved monthly income data
                return transactions;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving income transactions:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves month-wise expense data for the current year for the authenticated user.
     *
     * This method:
     * - Extracts the user ID from the provided JWT access token to authenticate the request.
     * - Fetches month-wise expense data using the transaction repository.
     * - Returns an array of objects containing each month and its corresponding total expense amount.
     * - Ensures all 12 months are included, even if no expense was recorded in some months.
     *
     * Useful for generating expense trend visualizations such as line or bar charts.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @returns {Promise<{ month: string; amount: number }[]>}
     *   A promise resolving to an array of objects where each object contains:
     *   - `month`: The abbreviated name of the month (e.g., "Jan", "Feb").
     *   - `amount`: The total expense for that month.
     *   Returns data for all 12 months, with `0` for months with no recorded expenses.
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the data retrieval process.
     */
    getMonthlyExpenseForChart(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch month-wise expense data.
                // This keeps the service layer clean and separates business logic from data access logic.
                const transactions = yield this._transactionRepository.getMonthlyExpenseForChart(userId);
                // Return the retrieved monthly expense data
                return transactions;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving expense transactions:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves paginated income transactions for the authenticated user based on various filters.
     *
     * This method:
     * - Extracts the user ID from the provided JWT access token to authenticate the request.
     * - Supports filtering by time range (last day, week, current month/year).
     * - Allows filtering by category and smart_category.
     * - Supports text search in description and tags.
     * - Uses pagination to limit the number of results returned.
     * - Delegates data fetching to the repository layer.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @param {number} [page=1] - The page number for pagination (default: 1).
     * @param {number} [limit=10] - Number of items per page (default: 10).
     * @param {'day'|'week'|'month'|'year'} [timeRange] - Optional time range filter.
     * @param {string} [category] - Optional category filter.
     * @param {string} [smartCategory] - Optional smart category filter.
     * @param {string} [searchText] - Optional text to search in description or tags.
     *
     * @returns {Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }>}
     *   A promise resolving to an object containing:
     *   - `data`: Paginated list of matched income transactions
     *   - `total`: Total number of matching documents
     *   - `currentPage`: Current page number
     *   - `totalPages`: Total number of pages available
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the data retrieval process.
     */
    getPaginatedIncomeTransactions(accessToken, page, limit, timeRange, category, searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch filtered and paginated income transactions.
                // This keeps the service layer clean and separates business logic from data access logic.
                const transactions = yield this._transactionRepository.getPaginatedIncomeTransactions(userId, page, limit, timeRange, category, searchText);
                // Return the retrieved transaction data
                return transactions;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving income transactions:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves paginated expense transactions for the authenticated user based on various filters.
     *
     * This method:
     * - Extracts the user ID from the provided JWT access token to authenticate the request.
     * - Supports filtering by time range (last day, week, current month/year).
     * - Allows filtering by category.
     * - Supports text search in description and tags.
     * - Uses pagination to limit the number of results returned.
     * - Delegates data fetching to the repository layer.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @param {number} [page=1] - The page number for pagination (default: 1).
     * @param {number} [limit=10] - Number of items per page (default: 10).
     * @param {'day'|'week'|'month'|'year'} [timeRange] - Optional time range filter.
     * @param {string} [category] - Optional category filter.
     * @param {string} [searchText] - Optional text to search in description or tags.
     *
     * @returns {Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }>}
     *   A promise resolving to an object containing:
     *   - `data`: Paginated list of matched expense transactions
     *   - `total`: Total number of matching documents
     *   - `currentPage`: Current page number
     *   - `totalPages`: Total number of pages available
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the data retrieval process.
     */
    getPaginatedExpenseTransactions(accessToken, page, limit, timeRange, category, searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch filtered and paginated expense transactions.
                // This keeps the service layer clean and separates business logic from data access logic.
                const transactions = yield this._transactionRepository.getPaginatedExpenseTransactions(userId, page, limit, timeRange, category, searchText);
                // Return the retrieved transaction data
                return transactions;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving expense transactions:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
    /**
    * Retrieves paginated income or expense transactions for the authenticated user based on various filters.
    *
    * This method:
    * - Extracts the user ID from the provided JWT access token to authenticate the request.
    * - Supports filtering by time range (last day, week, current month/year).
    * - Allows filtering by category and transaction type (Income/Expense).
    * - Supports text search in description and tags.
    * - Uses pagination to limit the number of results returned.
    * - Delegates data fetching to the repository layer.
    *
    * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
    * @param {number} [page=1] - The page number for pagination (default: 1).
    * @param {number} [limit=10] - Number of items per page (default: 10).
    * @param {'day'|'week'|'month'|'year'} [timeRange] - Optional time range filter.
    * @param {string} [category] - Optional category filter.
    * @param {string} [transactionType] - Optional transaction type filter ('Income' or 'Expense').
    * @param {string} [searchText] - Optional text to search in description or tags.
    *
    * @returns {Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }>}
    *   A promise resolving to an object containing:
    *   - `data`: Paginated list of matched transactions
    *   - `total`: Total number of matching documents
    *   - `currentPage`: Current page number
    *   - `totalPages`: Total number of pages available
    *
    * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
    * @throws {Error} If there's an internal error during the data retrieval process.
    */
    getPaginatedTransactions(accessToken, page, limit, timeRange, category, transactionType, searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the authenticated user's ID from the provided access token.
                // Ensures only authenticated users can access their own financial data.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    // If no user ID could be extracted from the token, authentication fails.
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository layer to fetch filtered and paginated expense transactions.
                // This keeps the service layer clean and separates business logic from data access logic.
                const transactions = yield this._transactionRepository.getPaginatedTransactions(userId, page, limit, timeRange, category, transactionType, searchText);
                // Return the retrieved transaction data
                return transactions;
            }
            catch (error) {
                // Log the error for internal debugging and monitoring purposes.
                console.error('Error retrieving expense transactions:', error);
                // Throw a generic error to avoid exposing sensitive internal details to the client.
                throw new Error(error.message);
            }
        });
    }
}
exports.default = TransactionService;
