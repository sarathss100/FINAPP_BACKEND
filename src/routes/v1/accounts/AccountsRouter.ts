import { Router } from 'express';
import AccountManagementRepository from '../../../repositories/accounts/AccountsManagementRepository';
import AccountsService from '../../../services/accounts/AccountService';
import AccountsController from '../../../controller/accounts/AccountsController';
import IAccountsController from '../../../controller/accounts/interfaces/IAccountsController';

const createAccountsRouter = function(accountsController: IAccountsController): Router {
    const router = Router();

    router.post('/', accountsController.addAccount.bind(accountsController));
    router.put('/:accountId', accountsController.updateAccount.bind(accountsController));
    router.delete('/:accountId', accountsController.removeAccount.bind(accountsController));
    router.get('/', accountsController.getUserAccounts.bind(accountsController));
    router.get('/balance', accountsController.getTotalBalance.bind(accountsController));
    router.get('/bank-balance', accountsController.getTotalBankBalance.bind(accountsController));
    router.get('/debt', accountsController.getTotalDebt.bind(accountsController));
    router.get('/investment', accountsController.getTotalInvestment.bind(accountsController));

    return router;
};

export default createAccountsRouter;
