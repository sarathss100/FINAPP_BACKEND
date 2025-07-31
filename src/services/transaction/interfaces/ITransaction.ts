import ITransactionDTO, { IParsedTransactionDTO } from "../../../dtos/transaction/TransactionDTO";

export default interface ITransactionService {
    createTransaction(accessToken: string, data: ITransactionDTO | ITransactionDTO[]): Promise<ITransactionDTO  | ITransactionDTO[]>;
    getUserTransactions(accessToken: string): Promise<ITransactionDTO[]>;
    getMonthlyTotalIncome(accessToken: string): Promise<{ currentMonthTotal: number, previousMonthTotal: number }>;
    getWeeklyTotalIncome(accessToken: string): Promise<number>;
    getMonthlyTotalExpense(accessToken: string): Promise<{ currentMonthExpenseTotal: number, previousMonthExpenseTotal: number }>;
    getCategoryWiseExpense(accessToken: string): Promise<{ category: string, value: number }[]>;
    extractTransactionData(file: Express.Multer.File): Promise<IParsedTransactionDTO[]>;
    getAllIncomeTransactionsByCategory(accessToken: string): Promise<{ category: string, total: number }[]>;
    getAllExpenseTransactionsByCategory(accessToken: string): Promise<{category: string, total: number}[]>;
    getMonthlyIncomeForChart(accessToken: string): Promise<{ month: string, amount: number }[]>;
    getMonthlyExpenseForChart(accessToken: string): Promise<{ month: string, amount: number }[]>;
    getPaginatedIncomeTransactions(
        accessToken: string,
        page: number,
        limit: number,
        timeRange?: 'day' | 'week' | 'month' | 'year',
        category?: string,
        searchText?: string,
    ): Promise<{ data: ITransactionDTO[], total: number, currentPage: number, totalPages: number }>;
    getPaginatedExpenseTransactions(
        accessToken: string,
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
