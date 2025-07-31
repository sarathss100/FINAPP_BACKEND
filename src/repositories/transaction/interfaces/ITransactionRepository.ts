import ITransactionDTO from '../../../dtos/transaction/TransactionDTO';
import ITransactionDocument from '../../../model/transaction/interfaces/ITransaction';

export default interface ITransactionRepository {
    createTransaction(data: Partial<ITransactionDocument>): Promise<ITransactionDocument>;
    createBulkTransactions(dataArray: Partial<ITransactionDocument>[]): Promise<ITransactionDocument[]>;
    getUserTransactions(userId: string): Promise<ITransactionDocument[]>;
    getMonthlyTotalIncome(userId: string): Promise<{ currentMonthTotal: number, previousMonthTotal: number }>;
    getWeeklyTotalIncome(userId: string): Promise<number>;
    getMonthlyTotalExpense(userId: string): Promise<{ currentMonthExpenseTotal: number, previousMonthExpenseTotal: number }>;
    getCategoryWiseExpense(userId: string): Promise<{ category: string, value: number }[]>;
    getExistingTransaction(userId: string, transactionHash: string): Promise<boolean>;
    getExistingTransactions(allHashes: string[]): Promise<ITransactionDocument[]>;
    getAllIncomeTransactionsByCategory(userId: string): Promise<{ category: string, total: number }[]>;
    getAllExpenseTransactionsByCategory(userId: string): Promise<{category: string, total: number}[]>;
    getMonthlyIncomeForChart(userId: string): Promise<{ month: string, amount: number }[]>;
    getMonthlyExpenseForChart(userId: string): Promise<{ month: string, amount: number }[]>;
    getPaginatedIncomeTransactions(
        userId: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }>;
    getPaginatedExpenseTransactions(
        userId: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }>;
    getPaginatedTransactions(
        userId: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        transactionType?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }>;
}
