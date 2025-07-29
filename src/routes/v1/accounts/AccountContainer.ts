import AccountsService from '../../../services/accounts/AccountService';
import AccountsController from '../../../controller/accounts/AccountsController';
import IAccountsController from '../../../controller/accounts/interfaces/IAccountsController';
import createAccountsRouter from './AccountsRouter';
import AccountsRepository from '../../../repositories/accounts/AccountsRepository';

class AccountsContainer {
    public readonly controller: IAccountsController;
    public readonly router: ReturnType<typeof createAccountsRouter>;

    constructor() {
        const repository = new AccountsRepository();
        const service = new AccountsService(repository);
        this.controller = new AccountsController(service);
        this.router = createAccountsRouter(this.controller);
    }
}

export default AccountsContainer;
