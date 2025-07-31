import TransactionRepository from '../../../repositories/transaction/TransactionRepository';
import TransactionService from '../../../services/transaction/TransactionService';
import TransactionController from '../../../controller/transaction/TransactionController';
import ITransactionController from '../../../controller/transaction/interfaces/ITransactionController';
import createTransactionRouter from './TransactionRouter';

export default class TransactionContainer {
    public readonly controller: ITransactionController;
    public readonly router: ReturnType<typeof createTransactionRouter>;

    constructor() {
        const repository = new TransactionRepository();
        const service = new TransactionService(repository);
        this.controller = new TransactionController(service);
        this.router = createTransactionRouter(this.controller);
    }
}
