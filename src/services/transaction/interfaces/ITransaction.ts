import { ITransactionDTO } from 'dtos/transaction/TransactionDto';

interface ITransactionService {
    createTransaction(accessToken: string, data: ITransactionDTO): Promise<ITransactionDTO>;
    getUserTransactions(accessToken: string): Promise<ITransactionDTO[]>;
}

export default ITransactionService;
