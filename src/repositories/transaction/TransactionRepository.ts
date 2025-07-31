import ITransactionDTO from '../../dtos/transaction/TransactionDTO';
import ITransactionRepository from './interfaces/ITransactionRepository';
import { TransactionModel } from '../../model/transaction/model/TransactionModel';
import ITransactionDocument from '../../model/transaction/interfaces/ITransaction';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import BaseRepository from '../base_repo/BaseRepository';

export default class TransactionRepository implements ITransactionRepository {
    private static _instance: TransactionRepository;
    private baseRepo: IBaseRepository<ITransactionDocument> = new BaseRepository<ITransactionDocument>(TransactionModel);
    public constructor() {};

    public static get instance(): TransactionRepository {
        if (!TransactionRepository._instance) {
            TransactionRepository._instance = new TransactionRepository();
        }
        return TransactionRepository._instance;
    }

    async createTransaction(data: Partial<ITransactionDocument>): Promise<ITransactionDocument> { 
        try {
            const result = await this.baseRepo.create(data);

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createBulkTransactions(dataArray: ITransactionDocument[]): Promise<ITransactionDocument[]> {
        try {
            // Use insertMany for bulk insertion (more efficient than multiple create operations)
            const results = await TransactionModel.insertMany(dataArray);

            return results;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getExistingTransaction(userId: string, transactionHash: string): Promise<boolean> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await this.baseRepo.findOne({ transactionHash });

            if (!result) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error retrieving transaction details:', error);
            return false;
        }
    }

    async getExistingTransactions(allHashes: string[]): Promise<ITransactionDocument[]> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await this.baseRepo.find({ transactionHash: { $in: allHashes }});

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

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
                    $sort: { category: 1 } 
                }
            ]);
        
            return categoryTotals || [];
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

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
                    $sort: { category: 1 }
                }
            ]);
        
            return categoryTotals || [];
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUserTransactions(userId: string): Promise<ITransactionDocument[]> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await TransactionModel.find({ user_id: userId }).sort({ createdAt: -1 });

            if (!result || result.length === 0) {
                throw new Error('No transactions found for the specified user');
            }

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMonthlyTotalIncome(userId: string): Promise<{currentMonthTotal: number, previousMonthTotal: number }> {
        try {
            const result = await this.baseRepo.find({ user_id: userId, transaction_type: 'INCOME' });

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
            throw new Error((error as Error).message);
        }
    }

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
            throw new Error((error as Error).message);
        }
    }

    async getMonthlyTotalExpense(userId: string): Promise<{ currentMonthExpenseTotal: number, previousMonthExpenseTotal: number }> {
        try {
            // Query the database for all EXPENSE transactions associated with the given user ID
            const result = await this.baseRepo.find({
                user_id: userId,
                transaction_type: 'EXPENSE'
            });
        
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
        
            return { currentMonthExpenseTotal, previousMonthExpenseTotal };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getCategoryWiseExpense(userId: string): Promise<{category: string, value: number}[]> {
        try {
            // Query the database for all EXPENSE transactions associated with the given user ID
            const result = await this.baseRepo.find({
                user_id: userId,
                transaction_type: 'EXPENSE'
            });
        
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

            return getCategoryWiseExpenses.sort((a, b) => b.value - a.value);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

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
            throw new Error((error as Error).message);
        }
    }

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
            throw new Error((error as Error).message);
        }
    }

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
                    $sort: { createdAt: -1 as 1 }
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
                data: result[0]?.data.map((d: ITransactionDTO) => ({
                    _id: d._id?.toString(),
                    user_id: d.user_id?.toString(),
                    account_id: d.account_id.toString(),
                    transaction_type: d.transaction_type,
                    type: d.type,
                    category: d.category,
                    amount: d.amount,
                    credit_amount: d.credit_amount || 0,
                    debit_amount: d.debit_amount || 0,
                    closing_balance: d.closing_balance || 0,
                    currency: d.currency as 'INR',
                    date: d.date,
                    description: d.description,
                    tags: d.tags,
                    status: d.status,
                    transactionHash: d.transactionHash,
                    related_account_id: d.related_account_id?.toString(),
                    linked_entities: d.linked_entities?.map(entity => ({
                        entity_id: entity.entity_id?.toString(),
                        entity_type: entity.entity_type,
                        amount: entity.amount,
                        currency: entity.currency as 'INR',
                    })),
                    isDeleted: d.isDeleted || false,
                    deletedAt: d.deletedAt,
                    createdAt: d.createdAt,
                    updatedAt: d.updatedAt,
                })) || [],
                total: result[0]?.total || 0,
                currentPage: result[0]?.currentPage || 1,
                totalPages: result[0]?.totalPages || 1,
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

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
                    $sort: { createdAt: -1 as 1 }
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
                data: result[0]?.data.map((d: ITransactionDTO) => ({
                    _id: d._id?.toString(),
                    user_id: d.user_id?.toString(),
                    account_id: d.account_id.toString(),
                    transaction_type: d.transaction_type,
                    type: d.type,
                    category: d.category,
                    amount: d.amount,
                    credit_amount: d.credit_amount || 0,
                    debit_amount: d.debit_amount || 0,
                    closing_balance: d.closing_balance || 0,
                    currency: d.currency as 'INR',
                    date: d.date,
                    description: d.description,
                    tags: d.tags,
                    status: d.status,
                    transactionHash: d.transactionHash,
                    related_account_id: d.related_account_id?.toString(),
                    linked_entities: d.linked_entities?.map(entity => ({
                        entity_id: entity.entity_id?.toString(),
                        entity_type: entity.entity_type,
                        amount: entity.amount,
                        currency: entity.currency as 'INR',
                    })),
                    isDeleted: d.isDeleted || false,
                    deletedAt: d.deletedAt,
                    createdAt: d.createdAt,
                    updatedAt: d.updatedAt,
                })) || [],
                total: result[0]?.total || 0,
                currentPage: result[0]?.currentPage || 1,
                totalPages: result[0]?.totalPages || 1,
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

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
                    $sort: { createdAt: -1 as 1 }
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
                data: result[0]?.data.map((d: ITransactionDTO) => ({
                    _id: d._id?.toString(),
                    user_id: d.user_id?.toString(),
                    account_id: d.account_id.toString(),
                    transaction_type: d.transaction_type,
                    type: d.type,
                    category: d.category,
                    amount: d.amount,
                    credit_amount: d.credit_amount || 0,
                    debit_amount: d.debit_amount || 0,
                    closing_balance: d.closing_balance || 0,
                    currency: d.currency as 'INR',
                    date: d.date,
                    description: d.description,
                    tags: d.tags,
                    status: d.status,
                    transactionHash: d.transactionHash,
                    related_account_id: d.related_account_id?.toString(),
                    linked_entities: d.linked_entities?.map(entity => ({
                        entity_id: entity.entity_id?.toString(),
                        entity_type: entity.entity_type,
                        amount: entity.amount,
                        currency: entity.currency as 'INR',
                    })),
                    isDeleted: d.isDeleted || false,
                    deletedAt: d.deletedAt,
                    createdAt: d.createdAt,
                    updatedAt: d.updatedAt,
                })) || [],
                total: result[0]?.total || 0,
                currentPage: result[0]?.currentPage || 1,
                totalPages: result[0]?.totalPages || 1,
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
