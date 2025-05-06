import { ITransactionDTO } from 'dtos/transaction/TransactionDto';

interface ITransactionRepository {
    createTransaction(data: ITransactionDTO): Promise<ITransactionDTO>;
}

export default ITransactionRepository;
