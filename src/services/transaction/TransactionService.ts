import ITransactionRepository from '../../repositories/transaction/interfaces/ITransactionRepository';
import ITransactionService from './interfaces/ITransaction';
import { IParsedTransaction, ITransactionDTO } from '../../dtos/transaction/TransactionDto';
import { decodeAndValidateToken } from '../../utils/auth/tokenUtils';
import { AuthenticationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { extractTransactionTable } from '../../utils/transaction/extractTransactionTable';
import { normalizeTransactionObject } from '../../utils/transaction/normalizeTransaction';
import crypto from 'crypto';
import { classifyTransaction } from '../../utils/transaction/classifyTransaction';
import TransactionRepository from '../../repositories/transaction/TransactionRepository';
import { eventBus } from '../../events/eventBus';

class TransactionService implements ITransactionService {
    private static _instance: TransactionService;
    private _transactionRepository: ITransactionRepository;

    constructor(transactionRepository: ITransactionRepository) {
        this._transactionRepository = transactionRepository;
    }

    public static get instance(): TransactionService {
        if (!TransactionService._instance) {
            const repo = TransactionRepository.instance;
            TransactionService._instance = new TransactionService(repo);
        }

        return TransactionService._instance;
    }

    /**
     * Normalizes a date string to ensure consistent format for hash generation
     * Handles different date input formats and types
     */
    private normalizeDate(date: string | Date): string {
        if (date instanceof Date) {
            // Convert Date object to ISO string format YYYY-MM-DD
            return date.toISOString().split('T')[0];
        } else if (typeof date === 'string') {
            // Try to parse the string as a date and normalize it
            try {
                const dateObj = new Date(date);
                if (!isNaN(dateObj.getTime())) {
                    return dateObj.toISOString().split('T')[0];
                }
            } catch (e) {
                // If parsing fails, just use the trimmed string
                console.error((e as Error).message);
            }
            return date.trim();
        }
        return String(date).trim();
    }

    // Generates a unique hash for a transaction based on date, description, and amount
    private generateHash(date: string, description: string, amount: number): string {
        const input = `${date.trim()}|${description.trim()}|${amount.toFixed(2)}`;
        return crypto.createHash('sha1').update(input).digest('hex');
    }

    /**
     * Record transaction(s) for the authenticated user, either single transaction or bulk.
     * Prevents duplicate transactions by checking transaction hash.
     */
    async createTransaction(accessToken: string, data: ITransactionDTO | ITransactionDTO[]): Promise<ITransactionDTO | ITransactionDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID associated with it
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Handle whether data is a single transaction or an array
            if (Array.isArray(data)) {
                // Process bulk transactions
                const response = await this.processBulkTransactions(userId, data);

                // Emit socket event to notify user about transaction Creation
                eventBus.emit('transaction_created', userId);

                return response;
            } else {
                // Process single transaction
                const response = await this.processSingleTransaction(userId, data);

                // Emit socket event to notify user about transaction Creation
                eventBus.emit('transaction_created', userId);

                return response;
            }
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller
            console.error('Error creating transaction:', error);
            throw new Error((error as Error).message);
        }
    }

    // Process a single transaction with hash checking
    private async processSingleTransaction(userId: string, data: ITransactionDTO): Promise<ITransactionDTO> {
        try {
           // Normalize date and handle potential undefined description
            const normalizedDate = this.normalizeDate(data.date);
            const description = data.description || '';
        
            // Generate hash for the transaction
            const transactionHash = this.generateHash(normalizedDate, description, data.amount);
        
            // Check if a transaction with this hash already exists for this user
            const existingTransaction = await this._transactionRepository.getExistingTransaction(userId, transactionHash);
        
            if (existingTransaction) {
                throw new Error(`Transaction with hash ${transactionHash} already exists. Skipping insertion.`);
            }
        
            // Add user ID and hash to transaction data
            const transactionData = { 
                ...data, 
                user_id: userId,
                transactionHash: transactionHash 
            };
        
            // Create the transaction
            return await this._transactionRepository.createTransaction(transactionData); 
        } catch (error) {
            throw new Error((error as Error).message);
        }   
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
    private async processBulkTransactions(userId: string, dataArray: ITransactionDTO[]): Promise<ITransactionDTO[]> {
       const results: ITransactionDTO[] = [];
       
       // Pre-compute hashes for all transactions and add userId
       const transactionsWithHash = dataArray.map(data => {
           // Normalize date format and handle potential undefined description
           const normalizedDate = this.normalizeDate(data.date);
           const description = data.description || '';
           const transactionHash = this.generateHash(normalizedDate, description, data.amount);
           
           const { category, type } = classifyTransaction(description);
           return {
               ...data,
               user_id: userId,
               transactionHash,
               category,
               type
           };
        });
        
        // Extract all hashes for bulk query
        const allHashes = transactionsWithHash.map(t => t.transactionHash);
        
        // Find all existing transactions in a single query
        const existingTransactions = await this._transactionRepository.getExistingTransactions(allHashes) || [];
        
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
            const createdTransactions = await this._transactionRepository.createBulkTransactions(newTransactions);
            results.push(...createdTransactions);
        }
        
        return results;
    }

    /**
     * Retrieves all transactions associated with the authenticated user.
     */
    async getUserTransactions(accessToken: string): Promise<ITransactionDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the transaction associated with the extracted user ID.
            const transactionDetails = await this._transactionRepository.getUserTransactions(userId);

            return transactionDetails;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving user transaction:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates and returns the total income for the current and previous month 
     * for the authenticated user based on their access token.
     */
    async getMonthlyTotalIncome(accessToken: string): Promise<{ currentMonthTotal: number, previousMonthTotal: number }> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);

            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Delegate to the repository layer to fetch and calculate monthly income totals.
            // This keeps the service layer clean and separates business logic from data access logic.
            const monthlyTransactionDetails = await this._transactionRepository.getMonthlyTotalIncome(userId);

            // Return the calculated monthly totals to the caller.
            return monthlyTransactionDetails;

        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving monthly transaction totals:', error);

            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates and returns the total income for the latest week
     * for the authenticated user based on their access token.
     */
    async getWeeklyTotalIncome(accessToken: string): Promise<number> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Fetch the weekly income total from the repository layer.
            const weeklyTotalIncome = await this._transactionRepository.getWeeklyTotalIncome(userId);
        
            // Return the calculated weekly income total.
            return weeklyTotalIncome;
        
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error retrieving weekly income:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves and calculates the total amount of expenses for the current month 
     * for the authenticated user based on their access token.
     */
    async getMonthlyTotalExpense(accessToken: string): Promise<{ currentMonthExpenseTotal: number, previousMonthExpenseTotal: number }> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch and calculate monthly expense totals.
            // This keeps the service layer clean and separates business logic from data access logic.
            const totalMonthlyExpense = await this._transactionRepository.getMonthlyTotalExpense(userId);
        
            // Return the calculated monthly expense total to the caller.
            return totalMonthlyExpense;
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving monthly expense total:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves and calculates the total amount of expenses for the current month 
     * for the authenticated user based on their access token.
     */
    async getCategoryWiseExpense(accessToken: string): Promise<{category: string, value: number}[]> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch and calculate monthly expense totals.
            // This keeps the service layer clean and separates business logic from data access logic.
            const categoryWiseExpenses = await this._transactionRepository.getCategoryWiseExpense(userId);
        
            // Return the calculated monthly expense total to the caller.
            return categoryWiseExpenses;
        
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving monthly expense total:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Extracts and processes transaction data from an uploaded file (CSV or Excel).
     * Converts the file into a standardized array of parsed transactions.
     */
    async extractTransactionData(file: Express.Multer.File): Promise<IParsedTransaction[]> {
        try {
            const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || '';
            let csvData: string;

            const buffer = file.buffer;

            if (fileExtension === 'csv') {
                csvData = buffer.toString('utf8');
            } else if (['xlsx', 'xls', 'xlsm'].includes(fileExtension)) {
                const workbook = XLSX.read(buffer, { type: 'buffer' });
                const firstSheetName = workbook.SheetNames[0];
                csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);
            } else {
                throw new Error(`Unsupported file format.`);
            }

            // This is the first layer of data extraction 
            const extractedTransactionTable = await extractTransactionTable(csvData);

            // This is the second layer of data extraction
            const processCSVData = this.processCSVData(extractedTransactionTable);

            // This is the third layer of data extraction 
            const normalizedData = Array.isArray(processCSVData)
            ? (processCSVData as ITransactionDTO[]).map(item => normalizeTransactionObject(item))
                : [];
            
            // This is the final layer of data extraction - filtering credit and debit fields
            const transactions = normalizedData.map(transaction => {
                const filteredTransaction = { ...transaction } as IParsedTransaction;

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

            return transactions as IParsedTransaction[];
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error extracting transaction data:', error);

            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }

    // function to process CSV data using Papa Parse
    private processCSVData(csvData: string) {
        const result: unknown[] = [];

        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
            complete: function (results) {
                result.push(...results.data);
          },
          error: function (error: Error) {
              throw new Error(`Error parsing CSV: ${(error as Error).message}`)
          },
        });

        return result;
    };

    /**
     * Retrieves all INCOME-type transactions for the authenticated user 
     * for the current year based on their access token.
     */
    async getAllIncomeTransactionsByCategory(accessToken: string): Promise<{category: string, total: number}[]> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch income transactions for the current year.
            // This keeps the service layer clean and separates business logic from data access logic.
            const transactions = await this._transactionRepository.getAllIncomeTransactionsByCategory(userId);
        
            // Return the retrieved transactions
            return transactions;
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving income transactions:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all EXPENSE-type transactions grouped by category for the authenticated user 
     * for the current year based on their access token.
     */
    async getAllExpenseTransactionsByCategory(accessToken: string): Promise<{ category: string, total: number }[]> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch expense transactions grouped by category.
            // This keeps the service layer clean and separates business logic from data access logic.
            const transactions = await this._transactionRepository.getAllExpenseTransactionsByCategory(userId);
        
            // Return the retrieved expense transactions grouped by category
            return transactions;
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving expense transactions by category:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }

    // Retrieves month-wise income data for the current year for the authenticated user.
    async getMonthlyIncomeForChart(accessToken: string): Promise<{ month: string, amount: number }[]> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch month-wise income data.
            // This keeps the service layer clean and separates business logic from data access logic.
            const transactions = await this._transactionRepository.getMonthlyIncomeForChart(userId);
        
            // Return the retrieved monthly income data
            return transactions;
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving income transactions:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
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
    async getMonthlyExpenseForChart(accessToken: string): Promise<{ month: string, amount: number }[]> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch month-wise expense data.
            // This keeps the service layer clean and separates business logic from data access logic.
            const transactions = await this._transactionRepository.getMonthlyExpenseForChart(userId);
        
            // Return the retrieved monthly expense data
            return transactions;
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving expense transactions:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
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
    async getPaginatedIncomeTransactions(
        accessToken: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch filtered and paginated income transactions.
            // This keeps the service layer clean and separates business logic from data access logic.
            const transactions = await this._transactionRepository.getPaginatedIncomeTransactions(
                userId,
                page,
                limit,
                timeRange,
                category,
                searchText
            );
        
            // Return the retrieved transaction data
            return transactions;
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving income transactions:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
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
    async getPaginatedExpenseTransactions(
        accessToken: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository layer to fetch filtered and paginated expense transactions.
            // This keeps the service layer clean and separates business logic from data access logic.
            const transactions = await this._transactionRepository.getPaginatedExpenseTransactions(
                userId,
                page,
                limit,
                timeRange,
                category,
                searchText
            );
        
            // Return the retrieved transaction data
            return transactions;
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving expense transactions:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
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
    async getPaginatedTransactions(
        accessToken: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        transactionType?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }> {
        try {
            // Extract the authenticated user's ID from the provided access token.
            // Ensures only authenticated users can access their own financial data.
            const userId = decodeAndValidateToken(accessToken);
        
            if (!userId) {
                // If no user ID could be extracted from the token, authentication fails.
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
            
            // Delegate to the repository layer to fetch filtered and paginated expense transactions.
            // This keeps the service layer clean and separates business logic from data access logic.
            const transactions = await this._transactionRepository.getPaginatedTransactions(
                userId,
                page,
                limit,
                timeRange,
                category,
                transactionType,
                searchText
            );
        
            // Return the retrieved transaction data
            return transactions;
        } catch (error) {
            // Log the error for internal debugging and monitoring purposes.
            console.error('Error retrieving expense transactions:', error);
        
            // Throw a generic error to avoid exposing sensitive internal details to the client.
            throw new Error((error as Error).message);
        }
    }
}

export default TransactionService;
