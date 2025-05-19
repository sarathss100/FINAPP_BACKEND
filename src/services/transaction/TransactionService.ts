import ITransactionRepository from 'repositories/transaction/interfaces/ITransactionRepository';
import ITransactionService from './interfaces/ITransaction';
import { IParsedTransaction, ITransactionDTO } from 'dtos/transaction/TransactionDto';
import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { extractTransactionTable } from 'utils/transaction/extractTransactionTable';
import { normalizeTransactionObject } from 'utils/transaction/normalizeTransaction';
import crypto from 'crypto';

/**
 * Service class for managing transaction, including creating and retrieving transactions.
 * This class interacts with the transaction repository to perform database operations.
 */
class TransactionService implements ITransactionService {
    private _transactionRepository: ITransactionRepository;

    /**
     * Constructs a new instance of the TransactionService.
     * 
     * @param {ITransactionRepository} TransactionRepository - The repository used for interacting with transaction data.
     */
    constructor(transactionRepository: ITransactionRepository) {
        this._transactionRepository = transactionRepository;
    }

    /**
     * Normalizes a date string to ensure consistent format for hash generation
     * Handles different date input formats and types
     * 
     * @param {string | Date} date - The date to normalize
     * @returns {string} - Normalized date string in YYYY-MM-DD format
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

    /**
     * Generates a unique hash for a transaction based on date, description, and amount
     * 
     * @param {string} date - The transaction date
     * @param {string} description - The transaction description
     * @param {number} amount - The transaction amount
     * @returns {string} - A SHA-1 hash of the transaction details
     */
    private generateHash(date: string, description: string, amount: number): string {
        const input = `${date.trim()}|${description.trim()}|${amount.toFixed(2)}`;
        return crypto.createHash('sha1').update(input).digest('hex');
    }

    /**
     * Record transaction(s) for the authenticated user, either single transaction or bulk.
     * Prevents duplicate transactions by checking transaction hash.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID
     * @param {ITransactionDTO | ITransactionDTO[]} data - The data required to create a single transaction or an array of transactions
     * @returns {Promise<ITransactionDTO | ITransactionDTO[]>} - A promise resolving to the created transaction object(s)
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID
     * @throws {Error} - Throws an error if the database operation fails
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
                return await this.processBulkTransactions(userId, data);
            } else {
                // Process single transaction
                return await this.processSingleTransaction(userId, data);
            }
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller
            console.error('Error creating transaction:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Process a single transaction with hash checking
     * 
     * @param {string} userId - User ID from decoded token
     * @param {ITransactionDTO} data - Transaction data
     * @returns {Promise<ITransactionDTO>} - Created transaction
     */
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
            
            return {
                ...data,
                user_id: userId,
                transactionHash
            };
        });
        
        // Extract all hashes for bulk query
        const allHashes = transactionsWithHash.map(t => t.transactionHash);
        
        // Find all existing transactions in a single query
        const existingTransactions = await this._transactionRepository.getExistingTransactions(allHashes) || [];
        
        // Create a Set of existing hashes for O(1) lookup
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
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of transaction objects associated with the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
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
     *
     * This method ensures:
     * - The user is authenticated via a valid JWT access token.
     * - Only relevant transaction data (e.g., income from dividends) is considered in the calculation.
     * - The calculated totals are returned as numerical values for both the current and previous month.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @returns {Promise<{ currentMonthTotal: number, previousMonthTotal: number }>} 
     *   A promise resolving to an object containing the total income for the current and previous month.
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the transaction retrieval or calculation process.
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
     * Retrieves and calculates the total amount of expenses for the current month 
     * for the authenticated user based on their access token.
     *
     * This method ensures:
     * - The user is authenticated via a valid JWT access token.
     * - Only EXPENSE-type transactions are considered.
     * - The total expense amount for the current month is returned.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @returns {Promise<number>} 
     *   A promise resolving to the total expense amount for the current month.
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the transaction retrieval or calculation process.
     */
    async getMonthlyTotalExpense(accessToken: string): Promise<number> {
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
     *
     * This method ensures:
     * - The user is authenticated via a valid JWT access token.
     * - Only EXPENSE-type transactions are considered.
     * - The total expense amount for the current month is returned.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user and extract their ID.
     * @returns {Promise<number>} 
     *   A promise resolving to the total expense amount for the current month.
     *
     * @throws {AuthenticationError} If the access token is invalid or does not contain a valid user ID.
     * @throws {Error} If there's an internal error during the transaction retrieval or calculation process.
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
     *
     * Supported file formats:
     * - CSV
     * - XLSX, XLS, XLSM (Excel formats)
     *
     * This method ensures:
     * - The file buffer is correctly read based on its format.
     * - CSV data is extracted from Excel files if needed.
     * - Raw CSV data is parsed and normalized into consistent transaction objects.
     *
     * @param {Express.Multer.File} file - The uploaded file containing transaction data.
     * @returns {Promise<IParsedTransaction[]>}
     *   A promise resolving to an array of normalized transaction objects.
     *
     * @throws {Error} If the file format is unsupported or if parsing fails.
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
}

export default TransactionService;
