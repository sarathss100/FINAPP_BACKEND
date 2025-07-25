import { ITransactionDTO } from '../../../dtos/transaction/TransactionDto';

interface ITransactionRepository {
    createTransaction(data: ITransactionDTO): Promise<ITransactionDTO>;
    createBulkTransactions(dataArray: ITransactionDTO[]): Promise<ITransactionDTO[]>;
    getUserTransactions(userId: string): Promise<ITransactionDTO[]>;
    getMonthlyTotalIncome(userId: string): Promise<{ currentMonthTotal: number, previousMonthTotal: number }>;
    getWeeklyTotalIncome(userId: string): Promise<number>;
    getMonthlyTotalExpense(userId: string): Promise<{ currentMonthExpenseTotal: number, previousMonthExpenseTotal: number }>;
    getCategoryWiseExpense(userId: string): Promise<{ category: string, value: number }[]>;
    getExistingTransaction(userId: string, transactionHash: string): Promise<boolean>;
    getExistingTransactions(allHashes: string[]): Promise<ITransactionDTO[] | undefined>;
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

export default ITransactionRepository;
