import { ITransactionDTO } from 'dtos/transaction/TransactionDto';

interface ITransactionRepository {
    createTransaction(data: ITransactionDTO): Promise<ITransactionDTO>;
    getUserTransactions(userId: string): Promise<ITransactionDTO[]>;
}

export default ITransactionRepository;
