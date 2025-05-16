import { ITransactionDTO } from 'dtos/transaction/TransactionDto';

interface ITransactionRepository {
    createTransaction(data: ITransactionDTO): Promise<ITransactionDTO>;
    getUserTransactions(userId: string): Promise<ITransactionDTO[]>;
    getMonthlyTotalIncome(userId: string): Promise<{ currentMonthTotal: number, previousMonthTotal: number }>;
    getMonthlyTotalExpense(userId: string): Promise<number>;
    getCategoryWiseExpense(userId: string): Promise<{ category: string, value: number }[]>;
}

export default ITransactionRepository;
