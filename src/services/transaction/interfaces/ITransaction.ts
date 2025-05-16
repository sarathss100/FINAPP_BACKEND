import { ITransactionDTO } from 'dtos/transaction/TransactionDto';

interface ITransactionService {
    createTransaction(accessToken: string, data: ITransactionDTO): Promise<ITransactionDTO>;
    getUserTransactions(accessToken: string): Promise<ITransactionDTO[]>;
    getMonthlyTotalIncome(accessToken: string): Promise<{ currentMonthTotal: number, previousMonthTotal: number }>;
    getMonthlyTotalExpense(accessToken: string): Promise<number>;
    getCategoryWiseExpense(accessToken: string): Promise<{category: string, value: number}[]>;
}

export default ITransactionService;
