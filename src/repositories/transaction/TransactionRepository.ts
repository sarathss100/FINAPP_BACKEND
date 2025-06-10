import { ITransactionDTO } from 'dtos/transaction/TransactionDto';
import ITransactionRepository from './interfaces/ITransactionRepository';
import { TransactionModel } from 'model/transaction/model/TransactionModel';

class TransactionRepository implements ITransactionRepository {
    /**
    * Creates a new transaction history in the database and returns the created transaction in ITransactionDTO format.
    * 
    * This method takes an input object (`transactionData`) containing transaction details, inserts it into the database using the `TransactionModel`,
    * and maps the result to the `ITransactionDTO` format. MongoDB ObjectIds are converted to strings for consistency in the DTO.
    * 
    * @param {ITransactionDTO} transactionData - The input data representing the transaction to be created. Must conform to the ITransactionDTO structure.
    * @returns {Promise<ITransactionDTO>} - A promise resolving to the created transaction in ITransactionDTO format, with ObjectIds converted to strings.
    * @throws {Error} - Throws an error if the database operation fails or if invalid data is provided.
    */
    async createTransaction(data: ITransactionDTO): Promise<ITransactionDTO> { 
        try {
            const result = await TransactionModel.create(data);
            const createdTransaction: ITransactionDTO = {
                _id: result._id.toString(),
                user_id: result.user_id.toString(),
                account_id: result.account_id.toString(),
                transaction_type: result.transaction_type as 'INCOME' | 'EXPENSE',
                type: result.type,
                category: result.category,
                amount: result.amount,    
                credit_amount: result.credit_amount || 0,
                debit_amount: result.debit_amount || 0,
                closing_balance: result.closing_balance || 0,
                currency: result.currency.toString() as 'INR',
                date: result.date,
                description: result.description,
                tags: result.tags,
                status: result.status,
                related_account_id: result.related_account_id?.toString(),
                linked_entities: result.linked_entities?.map((entity) => ({
                    entity_id: entity.entity_id?.toString(),
                    entity_type: entity.entity_type,
                    amount: entity.amount,
                    currency: entity.currency.toString() as 'INR',
                })),
                isDeleted: result.isDeleted || false,
                deletedAt: result.deletedAt,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            };
            return createdTransaction;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    /**
     * Creates multiple new transaction histories in the database in a single operation.
     * 
     * This method takes an array of transaction objects, performs a bulk insert using `insertMany`,
     * and maps the results to the `ITransactionDTO` format. MongoDB ObjectIds are converted to strings
     * for consistency in the DTOs.
     * 
     * @param {ITransactionDTO[]} dataArray - An array of input data representing transactions to be created.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of created transactions in ITransactionDTO format.
     * @throws {Error} - Throws an error if the database operation fails or if invalid data is provided.
     */
    async createBulkTransactions(dataArray: ITransactionDTO[]): Promise<ITransactionDTO[]> {
        try {
            // Use insertMany for bulk insertion (more efficient than multiple create operations)
            const results = await TransactionModel.insertMany(dataArray, { lean: true });

            // Map each result to the ITransactionDTO format
            const createdTransactions: ITransactionDTO[] = results.map(result => ({
                _id: result._id.toString(),
                user_id: result?.user_id?.toString(),
                account_id: result.account_id.toString(),
                transaction_type: result.transaction_type as 'INCOME' | 'EXPENSE',
                type: result.type,
                category: result.category,
                amount: result.amount,
                credit_amount: result.credit_amount || 0,
                debit_amount: result.debit_amount || 0,
                closing_balance: result.closing_balance || 0,
                currency: result.currency.toString() as 'INR',
                date: result.date,
                description: result.description,
                tags: result.tags,
                status: result.status,
                transactionHash: result.transactionHash, // Include the hash in the returned data
                related_account_id: result.related_account_id?.toString(),
                linked_entities: result.linked_entities?.map((entity) => ({
                    entity_id: entity.entity_id?.toString(),
                    entity_type: entity.entity_type,
                    amount: entity.amount,
                    currency: entity?.currency?.toString() as 'INR',
                })),
                isDeleted: result.isDeleted || false,
                deletedAt: result.deletedAt,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            }));

            return createdTransactions;
        } catch (error) {
            console.error('Error in bulk transaction creation:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all transactions associated with a specific user from the database.
     * 
     * @param {string} userId - The unique identifier of the user whose transactions are being retrieved.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of `ITransactionDTO` objects representing the user's transactions.
     * @throws {Error} - Throws an error if the database operation fails or no transactions are found for the given user.
     */
    async getExistingTransaction(userId: string, transactionHash: string): Promise<boolean> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await TransactionModel.findOne<ITransactionDTO>({ transactionHash });

            // it means no transactions were found for the given user, and an error is thrown.
            if (!result) {
                return false;
            }

            // Return the retrieved transactions as an array of `ITransactionDTO` objects.
            return true;
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);
            return false;
        }
    }

    /**
     * Retrieves all transactions associated with a specific user from the database.
     * 
     * @param {string} userId - The unique identifier of the user whose transactions are being retrieved.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of `ITransactionDTO` objects representing the user's transactions.
     * @throws {Error} - Throws an error if the database operation fails or no transactions are found for the given user.
     */
    async getExistingTransactions(allHashes: string[]): Promise<ITransactionDTO[] | undefined> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await TransactionModel.find({ transactionHash: { $in: allHashes }});

            // Map the result to ITransactionDTO format
            return result.map(transaction => ({
                _id: transaction._id.toString(),
                user_id: transaction.user_id.toString(),
                account_id: transaction.account_id.toString(),
                transaction_type: transaction.transaction_type,
                type: transaction.type,
                category: transaction.category,
                amount: transaction.amount,
                credit_amount: transaction.credit_amount || 0,
                debit_amount: transaction.debit_amount || 0,
                closing_balance: transaction.closing_balance || 0,
                currency: transaction.currency as 'INR',
                date: transaction.date,
                description: transaction.description,
                tags: transaction.tags,
                status: transaction.status,
                transactionHash: transaction.transactionHash,
                related_account_id: transaction.related_account_id?.toString(),
                linked_entities: transaction.linked_entities?.map(entity => ({
                    entity_id: entity.entity_id?.toString(),
                    entity_type: entity.entity_type,
                    amount: entity.amount,
                    currency: entity.currency as 'INR',
                })),
                isDeleted: transaction.isDeleted || false,
                deletedAt: transaction.deletedAt,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            }));
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);
        }
    }

    /**
     * Retrieves income transaction totals grouped by category for the current year for a specific user.
     * 
     * @param {string} userId - The unique identifier of the user whose income totals are being retrieved.
     * @returns {Promise<{category: string, total: number}[]>} - A promise resolving to an array of objects containing category and total amount.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getAllIncomeTransactionsByCategory(userId: string): Promise<{category: string, total: number}[]> {
        try {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1);
            const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
        
            const categoryTotals = await TransactionModel.aggregate([
                {
                    $match: {
                        user_id: userId,
                        transaction_type: 'INCOME',
                        date: {
                            $gte: startOfYear,
                            $lt: endOfYear,
                        }
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: '$_id',
                        total: 1
                    }
                },
                {
                    $sort: { category: 1 } // Optional: sort by category name
                }
            ]);
        
            return categoryTotals || [];
        } catch (error) {
            console.error('Error retrieving income totals by category:', error);
            return []; // Always return empty array on error
        }
    }

    /**
     * Retrieves all transactions associated with a specific user from the database.
     * 
     * @param {string} userId - The unique identifier of the user whose transactions are being retrieved.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of `ITransactionDTO` objects representing the user's transactions.
     * @throws {Error} - Throws an error if the database operation fails or no transactions are found for the given user.
     */
    async getUserTransactions(userId: string): Promise<ITransactionDTO[]> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await TransactionModel.find<ITransactionDTO>({ user_id: userId });

            // it means no transactions were found for the given user, and an error is thrown.
            if (!result || result.length === 0) {
                throw new Error('No transactions found for the specified user');
            }

            // Return the retrieved transactions as an array of `ITransactionDTO` objects.
            return result;
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all transactions associated with a specific user from the database.
     * 
     * @param {string} userId - The unique identifier of the user whose transactions are being retrieved.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of `ITransactionDTO` objects representing the user's transactions.
     * @throws {Error} - Throws an error if the database operation fails or no transactions are found for the given user.
     */
    async getMonthlyTotalIncome(userId: string): Promise<{currentMonthTotal: number, previousMonthTotal: number }> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await TransactionModel.find({ user_id: userId, transaction_type: 'INCOME' });

            // it means no transactions were found for the given user, and an error is thrown.
            if (!result || result.length === 0) {
                throw new Error('No transactions found for the specified user');
            }

            // Get the current date in UTC 
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth();

            // Previous month calculation
            const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

            let currentMonthTotal = 0;
            let previousMonthTotal = 0;

            result.forEach(transaction => {
                const date: Date = new Date(transaction.date);

                const transactionYear = date.getUTCFullYear();
                const transactionMonth = date.getUTCMonth();

                if (transactionYear === currentYear && transactionMonth === currentMonth) {
                    currentMonthTotal += transaction.amount;
                } else if (transactionYear === previousYear && transactionMonth === previousMonth) {
                    previousMonthTotal += transaction.amount;
                }
            });

            return { currentMonthTotal, previousMonthTotal };
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves the total income for the latest calendar week (Sunday - Saturday) for a specific user.
     *
     * @param {string} userId - The unique identifier of the user whose weekly income is being retrieved.
     * @returns {Promise<number>} - A promise resolving to the total income of the latest calendar week.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getWeeklyTotalIncome(userId: string): Promise<number> {
        try {
            const result = await TransactionModel.aggregate([
                {
                    $match: {
                        user_id: userId,
                        transaction_type: 'INCOME',
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateTrunc: {
                                date: "$date",
                                unit: "week",              
                                timezone: "Asia/Kolkata"     
                            }
                        },
                        totalIncome: {
                            $sum: "$amount"
                        }
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $limit: 1
                },
                {
                    $project: {
                        _id: 0,
                        totalIncome: 1
                    }
                }
            ]);

            return result[0]?.totalIncome || 0;

        } catch (error) {
            console.error('Error retrieving weekly income:', error);
            throw new Error(`Failed to retrieve weekly income: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves and calculates the total amount of EXPENSE-type transactions 
     * made by a specific user in the current calendar month.
     *
     * Only transactions marked as type 'EXPENSE' and occurring in the current month 
     * are considered in the total calculation.
     *
     * @param {string} userId - The unique identifier of the user whose expense data is being retrieved.
     * @returns {Promise<number>} A promise resolving to the total expense amount for the current month.
     * @throws {Error} Throws an error if the database operation fails or if no matching transactions are found.
     */
    async getMonthlyTotalExpense(userId: string): Promise<number> {
        try {
            // Query the database for all EXPENSE transactions associated with the given user ID
            const result = await TransactionModel.find<ITransactionDTO>({
                user_id: userId,
                transaction_type: 'EXPENSE'
            });
        
            // If no matching expense transactions are found, throw an appropriate error
            if (!result || result.length === 0) {
                throw new Error('No expense transactions found for the specified user');
            }
        
            // Get current date in UTC to determine the current month and year
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth(); // 0-indexed (Jan=0, ..., Dec=11)
        
            let currentMonthExpenseTotal = 0;
        
            // Loop through each transaction to check if it belongs to the current month
            result.forEach(transaction => {
                const date: Date = new Date(transaction.date);
            
                const transactionYear = date.getUTCFullYear();
                const transactionMonth = date.getUTCMonth();
            
                // Add to the total only if the transaction occurred in the current month
                if (transactionYear === currentYear && transactionMonth === currentMonth) {
                    currentMonthExpenseTotal += transaction.amount;
                }
            });
        
            // Return the calculated total expense for the current month
            return currentMonthExpenseTotal;
        
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error calculating monthly expense total:', error);
        
            // Re-throw the error with a descriptive message
            throw new Error(`Failed to retrieve monthly expense total: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves and calculates the total amount of EXPENSE-type transactions 
     * made by a specific user in the current calendar month.
     *
     * Only transactions marked as type 'EXPENSE' and occurring in the current month 
     * are considered in the total calculation.
     *
     * @param {string} userId - The unique identifier of the user whose expense data is being retrieved.
     * @returns {Promise<number>} A promise resolving to the total expense amount for the current month.
     * @throws {Error} Throws an error if the database operation fails or if no matching transactions are found.
     */
    async getCategoryWiseExpense(userId: string): Promise<{category: string, value: number}[]> {
        try {
            // Query the database for all EXPENSE transactions associated with the given user ID
            const result = await TransactionModel.find<ITransactionDTO>({
                user_id: userId,
                transaction_type: 'EXPENSE'
            });
        
            // If no matching expense transactions are found, throw an appropriate error
            if (!result || result.length === 0) {
                throw new Error('No expense transactions found for the specified user');
            }
        
            // Get current date in UTC to determine the current month and year
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth(); // 0-indexed (Jan=0, ..., Dec=11)
        
            const categoryTotals: { [key: string]: number } = {};
        
            // Loop through each transaction to check if it belongs to the current month
            result.forEach(transaction => {
                const date: Date = new Date(transaction.date);
            
                const transactionYear = date.getUTCFullYear();
                const transactionMonth = date.getUTCMonth();
            
                // Add to the total only if the transaction occurred in the current month
                if (transactionYear === currentYear && transactionMonth === currentMonth) {
                    const category = transaction.category || 'MISCELLANEOUS';
                    categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
                }
            });

            // Convert object to array format 
            const getCategoryWiseExpenses = Object.entries(categoryTotals).map(([category, value]) => ({
                category,
                value
            }));

            // Return the calculated total expense for the current month
            return getCategoryWiseExpenses.sort((a, b) => b.value - a.value);
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error calculating monthly expense total:', error);
        
            // Re-throw the error with a descriptive message
            throw new Error(`Failed to retrieve monthly expense total: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves month-wise income data for the current year for a specific user, suitable for charting.
     * 
     * This method:
     * - Filters INCOME-type transactions for the given user and current year.
     * - Groups transactions by month using MongoDB aggregation.
     * - Sums the total amount per month.
     * - Fills in missing months with zero to ensure all 12 months are included.
     *
     * @param {string} userId - The unique identifier of the user whose monthly income data is being retrieved.
     * @returns {Promise<{ month: string; amount: number }[]>} 
     *   A promise resolving to an array of objects where each object contains the month (e.g., "Jan") and the total income amount for that month.
     *   Returns all 12 months, even if some have zero income.
     *
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getMonthlyIncomeForChart(userId: string): Promise<{ month: string, amount: number }[]> {
        try {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1);
            const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

            // Query the database to retrieve all income transactions for the current year
            const result = await TransactionModel.aggregate([
                // Filter income transactions for current year and user
                {
                    $match: { 
                        user_id: userId,
                        transaction_type: 'INCOME',
                        date: {
                            $gte: startOfYear,
                            $lt: endOfYear,
                        }
                    }
                },
                // Extract month from date
                {
                    $project: {
                        month: { $month: "$date" }, // 1 to 12
                        amount: 1
                    }
                },
                // Group by month and sum amounts
                {
                    $group: {
                        _id: "$month",
                        totalAmount: { $sum: "$amount" }
                    }
                },
                // Sort by month 
                {
                    $sort: { _id: 1}
                }
            ]);

            // Fill in missing months with 0
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            const monthlyDate = Array.from({ length: 12 }, (_, i) => {
                const found = result.find(r => r._id === i + 1);
                return {
                    month: monthNames[i],
                    amount: found ? found.totalAmount : 0
                }
            });

            return monthlyDate;
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves paginated income transactions for a specific user based on various filters.
     * 
     * This method supports:
     * - Filtering by time range (last day, week, current month/year)
     * - Filtering by category and smart_category
     * - Search in description and tags
     * - Pagination using $skip and $limit
     *
     * @param {string} userId - The unique identifier of the user whose income transactions are being retrieved.
     * @param {number} [page=1] - The page number for pagination.
     * @param {number} [limit=10] - Number of items per page.
     * @param {'day'|'week'|'month'|'year'} [timeRange] - Optional time range filter.
     * @param {string} [category] - Optional category filter.
     * @param {string} [smartCategory] - Optional smart category filter.
     * @param {string} [searchText] - Optional text to search in description or tags.
     *
     * @returns {Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }>}
     *   A promise resolving to:
     *   - `data`: Paginated list of matched income transactions
     *   - `total`: Total number of matching documents
     *   - `currentPage`: Current page number
     *   - `totalPages`: Total number of pages available
     *
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getPaginatedIncomeTransactions(
        userId: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }> {
        try {
            const now = new Date();

            // Build dynamic date filter based on timeRange
            let dateFilter = {};

            if (timeRange === 'day') {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                dateFilter = {
                    date: {
                        $gte: yesterday,
                        $lte: now,
                    }
                };
            } else if (timeRange === 'week') {
                const oneWeekAgo = new Date(now);
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                dateFilter = {
                    date: {
                        $gte: oneWeekAgo,
                        $lte: now
                    }
                };
            } else if (timeRange === 'month') {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                dateFilter = {
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth,
                    }
                };
            } else if (timeRange === 'year') {
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const endOfYear = new Date(now.getFullYear() + 1, 0, 0);
                dateFilter = {
                    date: {
                        $gte: startOfYear,
                        $lte: endOfYear,
                    }
                }
            }

            const pipeline = [
                {
                    $match: {
                        user_id: userId,
                        transaction_type: 'INCOME',
                        ...dateFilter,
                        ...(category && { category }),
                        ...(searchText && {
                            $or: [
                                { description: { $regex: searchText, $options: 'i' } },
                                { tags: { $regex: searchText, $options: 'i' } },
                            ]
                        })
                    }
                },
                {
                    $sort: { date: -1 as 1 | -1 }
                },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit }
                        ]
                    }
                },
                {
                    $project: {
                        data: 1,
                        totalPages: {
                            $ceil: { $divide: [{ $arrayElemAt: ['$metadata.total', 0] }, limit] }
                        },
                        currentPage: { $literal: page },
                        total: { $arrayElemAt: ['$metadata.total', 0] }
                    }
                }
            ];

            const result = await TransactionModel.aggregate(pipeline);

            return {
                data: result[0]?.data || [],
                total: result[0]?.total || 0,
                currentPage: result[0]?.currentPage || 1,
                totalPages: result[0]?.totalPages || 1,
            }
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }
}

export default TransactionRepository;
