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
const TransactionModel_1 = require("model/transaction/model/TransactionModel");
class TransactionRepository {
    constructor() { }
    ;
    static get instance() {
        if (!TransactionRepository._instance) {
            TransactionRepository._instance = new TransactionRepository();
        }
        return TransactionRepository._instance;
    }
    // Creates a new transaction history in the database and returns the created transaction in ITransactionDTO format.
    createTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const result = yield TransactionModel_1.TransactionModel.create(data);
                const createdTransaction = {
                    _id: result._id.toString(),
                    user_id: result.user_id.toString(),
                    account_id: result.account_id.toString(),
                    transaction_type: result.transaction_type,
                    type: result.type,
                    category: result.category,
                    amount: result.amount,
                    credit_amount: result.credit_amount || 0,
                    debit_amount: result.debit_amount || 0,
                    closing_balance: result.closing_balance || 0,
                    currency: result.currency ? result.currency.toString() : 'INR',
                    date: result.date,
                    description: result.description,
                    tags: result.tags,
                    status: result.status,
                    related_account_id: (_a = result.related_account_id) === null || _a === void 0 ? void 0 : _a.toString(),
                    linked_entities: (_b = result.linked_entities) === null || _b === void 0 ? void 0 : _b.map((entity) => {
                        var _a;
                        return ({
                            entity_id: (_a = entity.entity_id) === null || _a === void 0 ? void 0 : _a.toString(),
                            entity_type: entity.entity_type,
                            amount: entity.amount,
                            currency: entity.currency.toString(),
                        });
                    }),
                    isDeleted: result.isDeleted || false,
                    deletedAt: result.deletedAt,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                };
                return createdTransaction;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // Creates multiple new transaction histories in the database in a single operation.
    createBulkTransactions(dataArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use insertMany for bulk insertion (more efficient than multiple create operations)
                const results = yield TransactionModel_1.TransactionModel.insertMany(dataArray, { lean: true });
                // Map each result to the ITransactionDTO format
                const createdTransactions = results.map(result => {
                    var _a, _b, _c;
                    return ({
                        _id: result._id.toString(),
                        user_id: (_a = result === null || result === void 0 ? void 0 : result.user_id) === null || _a === void 0 ? void 0 : _a.toString(),
                        account_id: result.account_id.toString(),
                        transaction_type: result.transaction_type,
                        type: result.type,
                        category: result.category,
                        amount: result.amount,
                        credit_amount: result.credit_amount || 0,
                        debit_amount: result.debit_amount || 0,
                        closing_balance: result.closing_balance || 0,
                        currency: result.currency ? result.currency.toString() : 'INR',
                        date: result.date,
                        description: result.description,
                        tags: result.tags,
                        status: result.status,
                        transactionHash: result.transactionHash, // Include the hash in the returned data
                        related_account_id: (_b = result.related_account_id) === null || _b === void 0 ? void 0 : _b.toString(),
                        linked_entities: (_c = result.linked_entities) === null || _c === void 0 ? void 0 : _c.map((entity) => {
                            var _a, _b;
                            return ({
                                entity_id: (_a = entity.entity_id) === null || _a === void 0 ? void 0 : _a.toString(),
                                entity_type: entity.entity_type,
                                amount: entity.amount,
                                currency: (_b = entity === null || entity === void 0 ? void 0 : entity.currency) === null || _b === void 0 ? void 0 : _b.toString(),
                            });
                        }),
                        isDeleted: result.isDeleted || false,
                        deletedAt: result.deletedAt,
                        createdAt: result.createdAt,
                        updatedAt: result.updatedAt,
                    });
                });
                return createdTransactions;
            }
            catch (error) {
                console.error('Error in bulk transaction creation:', error);
                throw new Error(error.message);
            }
        });
    }
    // Retrieves all transactions associated with a specific user from the database.
    getExistingTransaction(userId, transactionHash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database to retrieve all transactions associated with the given `userId`.
                const result = yield TransactionModel_1.TransactionModel.findOne({ transactionHash });
                // it means no transactions were found for the given user, and an error is thrown.
                if (!result) {
                    return false;
                }
                // Return the retrieved transactions as an array of `ITransactionDTO` objects.
                return true;
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving transaction details:', error);
                return false;
            }
        });
    }
    // Retrieves all transactions associated with a specific user from the database.
    getExistingTransactions(allHashes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database to retrieve all transactions associated with the given `userId`.
                const result = yield TransactionModel_1.TransactionModel.find({ transactionHash: { $in: allHashes } });
                // Map the result to ITransactionDTO format
                return result.map(transaction => {
                    var _a, _b;
                    return ({
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
                        currency: transaction.currency,
                        date: transaction.date,
                        description: transaction.description,
                        tags: transaction.tags,
                        status: transaction.status,
                        transactionHash: transaction.transactionHash,
                        related_account_id: (_a = transaction.related_account_id) === null || _a === void 0 ? void 0 : _a.toString(),
                        linked_entities: (_b = transaction.linked_entities) === null || _b === void 0 ? void 0 : _b.map(entity => {
                            var _a;
                            return ({
                                entity_id: (_a = entity.entity_id) === null || _a === void 0 ? void 0 : _a.toString(),
                                entity_type: entity.entity_type,
                                amount: entity.amount,
                                currency: entity.currency,
                            });
                        }),
                        isDeleted: transaction.isDeleted || false,
                        deletedAt: transaction.deletedAt,
                        createdAt: transaction.createdAt,
                        updatedAt: transaction.updatedAt,
                    });
                });
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving transaction details:', error);
            }
        });
    }
    // Retrieves income transaction totals grouped by category for the current year for a specific user.
    getAllIncomeTransactionsByCategory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
                const categoryTotals = yield TransactionModel_1.TransactionModel.aggregate([
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
            }
            catch (error) {
                console.error('Error retrieving income totals by category:', error);
                throw new Error('Error retrieving income totals by category');
            }
        });
    }
    // Retrieves expense transaction totals grouped by category for the current year for a specific user.
    getAllExpenseTransactionsByCategory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
                const categoryTotals = yield TransactionModel_1.TransactionModel.aggregate([
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
            }
            catch (error) {
                console.error('Error retrieving expense totals by category:', error);
                throw new Error('Error retrieving expense totals by category');
            }
        });
    }
    // Retrieves all transactions associated with a specific user from the database.
    getUserTransactions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database to retrieve all transactions associated with the given `userId`.
                const result = yield TransactionModel_1.TransactionModel.find({ user_id: userId });
                // it means no transactions were found for the given user, and an error is thrown.
                if (!result || result.length === 0) {
                    throw new Error('No transactions found for the specified user');
                }
                // Return the retrieved transactions as an array of `ITransactionDTO` objects.
                return result;
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving transaction details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error(error.message);
            }
        });
    }
    // Retrieves all transactions associated with a specific user from the database.
    getMonthlyTotalIncome(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database to retrieve all transactions associated with the given `userId`.
                const result = yield TransactionModel_1.TransactionModel.find({ user_id: userId, transaction_type: 'INCOME' });
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
                    const date = new Date(transaction.date);
                    const transactionYear = date.getUTCFullYear();
                    const transactionMonth = date.getUTCMonth();
                    if (transactionYear === currentYear && transactionMonth === currentMonth) {
                        currentMonthTotal += transaction.amount;
                    }
                    else if (transactionYear === previousYear && transactionMonth === previousMonth) {
                        previousMonthTotal += transaction.amount;
                    }
                });
                return { currentMonthTotal, previousMonthTotal };
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving transaction details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error('Error retrieving transaction details');
            }
        });
    }
    // Retrieves the total income for the latest calendar week (Sunday - Saturday) for a specific user.
    getWeeklyTotalIncome(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield TransactionModel_1.TransactionModel.aggregate([
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
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalIncome) || 0;
            }
            catch (error) {
                console.error('Error retrieving weekly income:', error);
                throw new Error(`Failed to retrieve weekly income: ${error.message}`);
            }
        });
    }
    /**
     * Retrieves and calculates the total amount of EXPENSE-type transactions
     * made by a specific user in the current calendar month.
     */
    getMonthlyTotalExpense(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database for all EXPENSE transactions associated with the given user ID
                const result = yield TransactionModel_1.TransactionModel.find({
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
                    const date = new Date(transaction.date);
                    const transactionYear = date.getUTCFullYear();
                    const transactionMonth = date.getUTCMonth();
                    // Add to the total only if the transaction occurred in the current month
                    if (transactionYear === currentYear && transactionMonth === currentMonth) {
                        currentMonthExpenseTotal += transaction.amount;
                    }
                    else if (transactionYear === previousYear && transactionMonth === previousMonth) {
                        previousMonthExpenseTotal += transaction.amount;
                    }
                });
                // Return the calculated total expense for the current month
                return { currentMonthExpenseTotal, previousMonthExpenseTotal };
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error calculating monthly expense total:', error);
                // Re-throw the error with a descriptive message
                throw new Error(`Failed to retrieve monthly expense total`);
            }
        });
    }
    /**
     * Retrieves and calculates the total amount of EXPENSE-type transactions
     * made by a specific user in the current calendar month.
     */
    getCategoryWiseExpense(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database for all EXPENSE transactions associated with the given user ID
                const result = yield TransactionModel_1.TransactionModel.find({
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
                const categoryTotals = {};
                // Loop through each transaction to check if it belongs to the current month
                result.forEach(transaction => {
                    const date = new Date(transaction.date);
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
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error calculating monthly expense total:', error);
                // Re-throw the error with a descriptive message
                throw new Error(`Failed to retrieve monthly expense total`);
            }
        });
    }
    // Retrieves month-wise income data for the current year for a specific user, suitable for charting.
    getMonthlyIncomeForChart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
                // Query the database to retrieve all income transactions for the current year
                const result = yield TransactionModel_1.TransactionModel.aggregate([
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
                        $sort: { _id: 1 }
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
                    };
                });
                return monthlyDate;
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving transaction details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error('Error retrieving transaction details');
            }
        });
    }
    // Retrieves month-wise expense data for the current year for a specific user, suitable for charting.
    getMonthlyExpenseForChart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
                // Query the database to retrieve all expense transactions for the current year
                const result = yield TransactionModel_1.TransactionModel.aggregate([
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
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error retrieving monthly expense data:', error);
                // Re-throw the error with a descriptive message
                throw new Error('Error retrieving monthly expense data');
            }
        });
    }
    // Retrieves paginated income transactions for a specific user based on various filters.
    getPaginatedIncomeTransactions(userId, page, limit, timeRange, category, searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
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
                }
                else if (timeRange === 'week') {
                    const oneWeekAgo = new Date(now);
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    dateFilter = {
                        date: {
                            $gte: oneWeekAgo,
                            $lte: now
                        }
                    };
                }
                else if (timeRange === 'month') {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    dateFilter = {
                        date: {
                            $gte: startOfMonth,
                            $lte: endOfMonth,
                        }
                    };
                }
                else if (timeRange === 'year') {
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
                        $match: Object.assign(Object.assign(Object.assign({ user_id: userId, transaction_type: 'INCOME' }, dateFilter), (category && { category })), (searchText && {
                            $or: [
                                { description: { $regex: searchText, $options: 'i' } },
                                { tags: { $regex: searchText, $options: 'i' } },
                            ]
                        }))
                    },
                    {
                        $sort: { date: -1 }
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
                const result = yield TransactionModel_1.TransactionModel.aggregate(pipeline);
                return {
                    data: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [],
                    total: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
                    currentPage: ((_c = result[0]) === null || _c === void 0 ? void 0 : _c.currentPage) || 1,
                    totalPages: ((_d = result[0]) === null || _d === void 0 ? void 0 : _d.totalPages) || 1,
                };
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving transaction details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error(error.message);
            }
        });
    }
    // Retrieves paginated expense transactions for a specific user based on various filters.
    getPaginatedExpenseTransactions(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 10, timeRange, category, searchText) {
            var _a, _b, _c, _d;
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
                }
                else if (timeRange === 'week') {
                    const oneWeekAgo = new Date(now);
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    dateFilter = {
                        date: {
                            $gte: oneWeekAgo,
                            $lte: now
                        }
                    };
                }
                else if (timeRange === 'month') {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    dateFilter = {
                        date: {
                            $gte: startOfMonth,
                            $lte: endOfMonth,
                        }
                    };
                }
                else if (timeRange === 'year') {
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
                        $match: Object.assign(Object.assign(Object.assign({ user_id: userId, transaction_type: 'EXPENSE' }, dateFilter), (category && { category })), (searchText && {
                            $or: [
                                { description: { $regex: searchText, $options: 'i' } },
                                { tags: { $regex: searchText, $options: 'i' } },
                            ]
                        }))
                    },
                    {
                        $sort: { date: -1 }
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
                const result = yield TransactionModel_1.TransactionModel.aggregate(pipeline);
                return {
                    data: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [],
                    total: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
                    currentPage: ((_c = result[0]) === null || _c === void 0 ? void 0 : _c.currentPage) || 1,
                    totalPages: ((_d = result[0]) === null || _d === void 0 ? void 0 : _d.totalPages) || 1,
                };
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving transaction details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error(error.message);
            }
        });
    }
    // Retrieves paginated income or expense transactions for a specific user based on various filters.
    getPaginatedTransactions(userId, page, limit, timeRange, category, transactionType, searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
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
                }
                else if (timeRange === 'week') {
                    const oneWeekAgo = new Date(now);
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    dateFilter = {
                        date: {
                            $gte: oneWeekAgo,
                            $lte: now
                        }
                    };
                }
                else if (timeRange === 'month') {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    dateFilter = {
                        date: {
                            $gte: startOfMonth,
                            $lte: endOfMonth,
                        }
                    };
                }
                else if (timeRange === 'year') {
                    const startOfYear = new Date(now.getFullYear(), 0, 1);
                    const endOfYear = new Date(now.getFullYear() + 1, 0, 0);
                    dateFilter = {
                        date: {
                            $gte: startOfYear,
                            $lte: endOfYear,
                        }
                    };
                }
                let transaction_type = '';
                if (transactionType === 'INCOME') {
                    transaction_type = 'INCOME';
                }
                else if (transactionType === 'EXPENSE') {
                    transaction_type = 'EXPENSE';
                }
                const pipeline = [
                    {
                        $match: Object.assign(Object.assign(Object.assign(Object.assign({ user_id: userId }, dateFilter), (transaction_type && { transaction_type })), (category && { category })), (searchText && {
                            $or: [
                                { description: { $regex: searchText, $options: 'i' } },
                                { tags: { $regex: searchText, $options: 'i' } },
                            ]
                        }))
                    },
                    {
                        $sort: { date: -1 }
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
                const result = yield TransactionModel_1.TransactionModel.aggregate(pipeline);
                return {
                    data: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [],
                    total: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
                    currentPage: ((_c = result[0]) === null || _c === void 0 ? void 0 : _c.currentPage) || 1,
                    totalPages: ((_d = result[0]) === null || _d === void 0 ? void 0 : _d.totalPages) || 1,
                };
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving transaction details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error(error.message);
            }
        });
    }
}
exports.default = TransactionRepository;
