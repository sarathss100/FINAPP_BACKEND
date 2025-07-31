import ITransactionRepository from '../../repositories/transaction/interfaces/ITransactionRepository';
import ITransactionService from './interfaces/ITransaction';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { extractTransactionTable } from '../../utils/transaction/extractTransactionTable';
import { normalizeTransactionObject } from '../../utils/transaction/normalizeTransaction';
import crypto from 'crypto';
import { classifyTransaction } from '../../utils/transaction/classifyTransaction';
import TransactionRepository from '../../repositories/transaction/TransactionRepository';
import { eventBus } from '../../events/eventBus';
import ITransactionDTO, { IParsedTransactionDTO } from '../../dtos/transaction/TransactionDTO';
import { extractUserIdFromToken, wrapServiceError } from '../../utils/serviceUtils';
import TransactionMapper from '../../mappers/transactions/TransactionMapper';

export default class TransactionService implements ITransactionService {
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

    async createTransaction(accessToken: string, data: ITransactionDTO | ITransactionDTO[]): Promise<ITransactionDTO | ITransactionDTO[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);

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
            console.error('Error creating transaction:', error);
            throw wrapServiceError(error);
        }
    }

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

            const mappedModel = TransactionMapper.toModel(transactionData);

            const transaction = await this._transactionRepository.createTransaction(mappedModel);

            const resultDTO = TransactionMapper.toDTO(transaction);
        
            return resultDTO;
        } catch (error) {
            console.error('Error while processing single transaction:', error);
            throw wrapServiceError(error);
        }   
    }

    /**
    * Process multiple transactions with hash checking
    * More efficient implementation that:
    * 1. Pre-computes all hashes
    * 2. Performs a single bulk database query for all existing hashes
    * 3. Processes only the new transactions in batch
    */
    private async processBulkTransactions(userId: string, dataArray: ITransactionDTO[]): Promise<ITransactionDTO[]> {
        try {
            const results: ITransactionDTO[] = [];
       
            // Pre-compute hashes for all transactions and add userId
            const transactionsWithHash = dataArray.map(data => {
            const normalizedDate = this.normalizeDate(data.date);
            // Normalize date format and handle potential undefined description
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
            const resultDTO = TransactionMapper.toDTOs(existingTransactions);
            
            // Create a Set of existing hashes
            const existingHashSet = new Set(resultDTO.map(t => t.transactionHash));
            
            // Add existing transactions to results
            for (const existingTx of resultDTO) {
                console.log(`Transaction with hash ${existingTx.transactionHash} already exists. Skipping insertion.`);
                results.push(existingTx);
            }
                
            // Filter out only new transactions that don't exist in the database
            const newTransactions = transactionsWithHash.filter(t => !existingHashSet.has(t.transactionHash));
            
            if (newTransactions.length > 0) {
                const mappedModels = TransactionMapper.toModels(newTransactions);
                // Bulk create all new transactions at once if there are any
                const createdTransactions = await this._transactionRepository.createBulkTransactions(mappedModels);
                const resultDTOs = TransactionMapper.toDTOs(createdTransactions);
                results.push(...resultDTOs);
            }
            
            return results;
        } catch (error) {
            console.error('Error processing bulk transactions:', error);
            throw wrapServiceError(error);
        }
       
    }

    async getUserTransactions(accessToken: string): Promise<ITransactionDTO[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Call the repository to retrieve the transaction associated with the extracted user ID.
            const transactionDetails = await this._transactionRepository.getUserTransactions(userId);

            const resultDTOs = TransactionMapper.toDTOs(transactionDetails);

            return resultDTOs;
        } catch (error) {
            console.error('Error while getting user transactions:', error);
            throw wrapServiceError(error);
        }
    }

    async getMonthlyTotalIncome(accessToken: string): Promise<{ currentMonthTotal: number, previousMonthTotal: number }> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Delegate to the repository layer to fetch and calculate monthly income totals.
            const monthlyTransactionDetails = await this._transactionRepository.getMonthlyTotalIncome(userId);

            // Return the calculated monthly totals to the caller.
            return monthlyTransactionDetails;
        } catch (error) {
            console.error('Error retrieving monthly transaction totals:', error);
            throw wrapServiceError(error);
        }
    }

    async getWeeklyTotalIncome(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Fetch the weekly income total from the repository layer.
            const weeklyTotalIncome = await this._transactionRepository.getWeeklyTotalIncome(userId);
        
            return weeklyTotalIncome;
        } catch (error) {
            console.error('Error retrieving weekly income:', error);
            throw wrapServiceError(error);
        }
    }

    async getMonthlyTotalExpense(accessToken: string): Promise<{ currentMonthExpenseTotal: number, previousMonthExpenseTotal: number }> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository layer to fetch and calculate monthly expense totals.
            const totalMonthlyExpense = await this._transactionRepository.getMonthlyTotalExpense(userId);
        
            return totalMonthlyExpense;
        } catch (error) {
            console.error('Error retrieving monthly expense total:', error);
            throw wrapServiceError(error);
        }
    }

    async getCategoryWiseExpense(accessToken: string): Promise<{category: string, value: number}[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository layer to fetch and calculate monthly expense totals.
            const categoryWiseExpenses = await this._transactionRepository.getCategoryWiseExpense(userId);
        
            return categoryWiseExpenses;
        } catch (error) {
            console.error('Error retrieving monthly expense total:', error);
            throw wrapServiceError(error);
        }
    }

    async extractTransactionData(file: Express.Multer.File): Promise<IParsedTransactionDTO[]> {
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
            ? (processCSVData).map(item => normalizeTransactionObject(item))
                : [];
            
            // This is the final layer of data extraction - filtering credit and debit fields
            const transactions = normalizedData.map(transaction => {
                const filteredTransaction = { ...transaction } as IParsedTransactionDTO;

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

            return transactions as IParsedTransactionDTO[];
        } catch (error) {
            console.error('Error extracting transaction data:', error);
            throw wrapServiceError(error);
        }
    }

    // function to process CSV data using Papa Parse
    private async processCSVData(csvData: string) {
        try {
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
        } catch (error) {
            console.error('Error while processing csv data:', error);
            throw wrapServiceError(error);
        }
    };

    async getAllIncomeTransactionsByCategory(accessToken: string): Promise<{category: string, total: number}[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository layer to fetch income transactions for the current year.
            const transactions = await this._transactionRepository.getAllIncomeTransactionsByCategory(userId);
        
            return transactions;
        } catch (error) {
            console.error('Error retrieving income transactions:', error);
            throw wrapServiceError(error);
        }
    }

    async getAllExpenseTransactionsByCategory(accessToken: string): Promise<{ category: string, total: number }[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository layer to fetch expense transactions grouped by category.
            const transactions = await this._transactionRepository.getAllExpenseTransactionsByCategory(userId);
        
            return transactions;
        } catch (error) {
            console.error('Error retrieving expense transactions by category:', error);
            throw wrapServiceError(error);
        }
    }

    async getMonthlyIncomeForChart(accessToken: string): Promise<{ month: string, amount: number }[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository layer to fetch month-wise income data.
            const transactions = await this._transactionRepository.getMonthlyIncomeForChart(userId);
        
            return transactions;
        } catch (error) {
            console.error('Error retrieving income transactions:', error);
            throw wrapServiceError(error);
        }
    }

    async getMonthlyExpenseForChart(accessToken: string): Promise<{ month: string, amount: number }[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository layer to fetch month-wise expense data.
            const transactions = await this._transactionRepository.getMonthlyExpenseForChart(userId);
        
            return transactions;
        } catch (error) {
            console.error('Error retrieving expense transactions:', error);
            throw wrapServiceError(error);
        }
    }

    async getPaginatedIncomeTransactions(
        accessToken: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository layer to fetch filtered and paginated income transactions.
            const transactions = await this._transactionRepository.getPaginatedIncomeTransactions(
                userId,
                page,
                limit,
                timeRange,
                category,
                searchText
            );
        
            return transactions;
        } catch (error) {
            console.error('Error retrieving income transactions:', error);
            throw wrapServiceError(error);
        }
    }

    async getPaginatedExpenseTransactions(
        accessToken: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository layer to fetch filtered and paginated expense transactions.
            const transactions = await this._transactionRepository.getPaginatedExpenseTransactions(
                userId,
                page,
                limit,
                timeRange,
                category,
                searchText
            );
        
            return transactions;
        } catch (error) {
            console.error('Error retrieving expense transactions:', error);
            throw wrapServiceError(error);
        }
    }

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
            const userId = extractUserIdFromToken(accessToken);
            
            // Delegate to the repository layer to fetch filtered and paginated expense transactions.
            const transactions = await this._transactionRepository.getPaginatedTransactions(
                userId,
                page,
                limit,
                timeRange,
                category,
                transactionType,
                searchText
            );
        
            return transactions;
        } catch (error) {
            console.error('Error retrieving expense transactions:', error);
            throw wrapServiceError(error);
        }
    }
}
