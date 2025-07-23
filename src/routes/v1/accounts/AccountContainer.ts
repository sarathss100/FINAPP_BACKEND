import AccountManagementRepository from 'repositories/accounts/AccountsManagementRepository';
import AccountsService from 'services/accounts/AccountService';
import AccountsController from 'controller/accounts/AccountsController';
import IAccountsController from 'controller/accounts/interfaces/IAccountsController';
import createAccountsRouter from './AccountsRouter';

class AccountsContainer {
    public readonly controller: IAccountsController;
    public readonly router: ReturnType<typeof createAccountsRouter>;

    constructor() {
        const repository = new AccountManagementRepository();
        const service = new AccountsService(repository);
        this.controller = new AccountsController(service);
        this.router = createAccountsRouter(this.controller);
    }
}

export default AccountsContainer;
