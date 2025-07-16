import { ITransactionDTO } from 'dtos/transaction/TransactionDto';
import ITransactionRepository from './interfaces/ITransactionRepository';
import { TransactionModel } from 'model/transaction/model/TransactionModel';

class TransactionRepository implements ITransactionRepository {
    private static _instance: TransactionRepository;
    public constructor() {};

    public static get instance(): TransactionRepository {
        if (!TransactionRepository._instance) {
            TransactionRepository._instance = new TransactionRepository();
        }
        return TransactionRepository._instance;
    }

    // Creates a new transaction history in the database and returns the created transaction in ITransactionDTO format.
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
                currency: result.currency ? result.currency.toString() as 'INR' : 'INR',
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

    // Creates multiple new transaction histories in the database in a single operation.
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
                currency: result.currency ? result.currency.toString() as 'INR' : 'INR',
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

    // Retrieves all transactions associated with a specific user from the database.
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

    // Retrieves all transactions associated with a specific user from the database.
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

    // Retrieves income transaction totals grouped by category for the current year for a specific user.
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
            throw new Error('Error retrieving income totals by category')
        }
    }

    // Retrieves expense transaction totals grouped by category for the current year for a specific user.
    async getAllExpenseTransactionsByCategory(userId: string): Promise<{ category: string, total: number }[]> {
        try {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1);
            const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
        
            const categoryTotals = await TransactionModel.aggregate([
                {
                    $match: {
                        user_id: userId,
                        transaction_type: 'EXPENSE',
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
                    $sort: { category: 1 } // Sort alphabetically by category name
                }
            ]);
        
            return categoryTotals || [];
        } catch (error) {
            console.error('Error retrieving expense totals by category:', error);
            throw new Error('Error retrieving expense totals by category')
        }
    }

    // Retrieves all transactions associated with a specific user from the database.
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

    // Retrieves all transactions associated with a specific user from the database.
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
            throw new Error('Error retrieving transaction details');
        }
    }

    // Retrieves the total income for the latest calendar week (Sunday - Saturday) for a specific user.
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
     */
    async getMonthlyTotalExpense(userId: string): Promise<{ currentMonthExpenseTotal: number, previousMonthExpenseTotal: number }> {
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
            const currentMonth = now.getUTCMonth(); 

            // Previous month calculation
            const previousMonth = currentMonth === 0 ? 11 : currentMonth - 11;
            const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
            let currentMonthExpenseTotal = 0;
            let previousMonthExpenseTotal = 0;
        
            // Loop through each transaction to check if it belongs to the current month
            result.forEach(transaction => {
                const date: Date = new Date(transaction.date);
            
                const transactionYear = date.getUTCFullYear();
                const transactionMonth = date.getUTCMonth();
            
                // Add to the total only if the transaction occurred in the current month
                if (transactionYear === currentYear && transactionMonth === currentMonth) {
                    currentMonthExpenseTotal += transaction.amount;
                } else if (transactionYear === previousYear && transactionMonth === previousMonth) {
                    previousMonthExpenseTotal += transaction.amount;
                }
            });
        
            // Return the calculated total expense for the current month
            return { currentMonthExpenseTotal, previousMonthExpenseTotal };
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error calculating monthly expense total:', error);
        
            // Re-throw the error with a descriptive message
            throw new Error(`Failed to retrieve monthly expense total`);
        }
    }

    /**
     * Retrieves and calculates the total amount of EXPENSE-type transactions 
     * made by a specific user in the current calendar month.
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
            throw new Error(`Failed to retrieve monthly expense total`);
        }
    }

    // Retrieves month-wise income data for the current year for a specific user, suitable for charting.
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
            throw new Error('Error retrieving transaction details');
        }
    }

    // Retrieves month-wise expense data for the current year for a specific user, suitable for charting.
    async getMonthlyExpenseForChart(userId: string): Promise<{ month: string, amount: number }[]> {
        try {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1);
            const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
        
            // Query the database to retrieve all expense transactions for the current year
            const result = await TransactionModel.aggregate([
                // Filter expense transactions for current year and user
                {
                    $match: { 
                        user_id: userId,
                        transaction_type: 'EXPENSE',
                        date: {
                            $gte: startOfYear,
                            $lt: endOfYear,
                        }
                    }
                },
                // Extract month from date (1 to 12)
                {
                    $project: {
                        month: { $month: "$date" },
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
                // Sort by month (ascending order)
                {
                    $sort: { _id: 1 }
                }
            ]);
        
            // Fill in missing months with 0
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
        
            const monthlyData = Array.from({ length: 12 }, (_, i) => {
                const found = result.find(r => r._id === i + 1);
                return {
                    month: monthNames[i],
                    amount: found ? found.totalAmount : 0
                };
            });
        
            return monthlyData;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error retrieving monthly expense data:', error);
        
            // Re-throw the error with a descriptive message
            throw new Error('Error retrieving monthly expense data');
        }
    }

    // Retrieves paginated income transactions for a specific user based on various filters.
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

    // Retrieves paginated expense transactions for a specific user based on various filters.
    async getPaginatedExpenseTransactions(
        userId: string,
        page: number = 1,
        limit: number = 10,
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
                };
            }
        
            const pipeline = [
                {
                    $match: {
                        user_id: userId,
                        transaction_type: 'EXPENSE',
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
            };
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);
        
            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }

    // Retrieves paginated income or expense transactions for a specific user based on various filters.
    async getPaginatedTransactions(
        userId: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        transactionType?: string,
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


            let transaction_type = '';
            if (transactionType === 'INCOME') {
                transaction_type = 'INCOME';
            } else if (transactionType === 'EXPENSE') {
                transaction_type = 'EXPENSE';
            }

            const pipeline = [
                {
                    $match: {
                        user_id: userId,
                        ...dateFilter,
                        ...(transaction_type && { transaction_type }),
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
