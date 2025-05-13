import { Router } from 'express';
import AccountManagementRepository from 'repositories/accounts/AccountsManagementRepository';
import AccountsService from 'services/accounts/AccountService';
import AccountsController from 'controller/accounts/AccountsController';
import IAccountsController from 'controller/accounts/interfaces/IAccountsController';

const router = Router();
const accountsRepository = new AccountManagementRepository();
const accountService = new AccountsService(accountsRepository);
const accountsController: IAccountsController = new AccountsController(accountService);

router.post('/create', accountsController.addAccount.bind(accountsController));
router.post('/update', accountsController.updateAccount.bind(accountsController));
router.delete('/delete', accountsController.removeAccount.bind(accountsController));
router.get('/details', accountsController.getUserAccounts.bind(accountsController));

export default router;
