import { ITransactionDTO } from 'dtos/transaction/TransactionDto';

interface ITransactionService {
    createTransaction(accessToken: string, data: ITransactionDTO): Promise<ITransactionDTO>;
}

export default ITransactionService;
