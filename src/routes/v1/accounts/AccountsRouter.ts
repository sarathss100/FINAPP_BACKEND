import { Router } from 'express';
import AccountManagementRepository from '../../../repositories/accounts/AccountsManagementRepository';
import AccountsService from '../../../services/accounts/AccountService';
import AccountsController from '../../../controller/accounts/AccountsController';
import IAccountsController from '../../../controller/accounts/interfaces/IAccountsController';

const router = Router();
const accountsRepository = new AccountManagementRepository();
const accountService = new AccountsService(accountsRepository);
const accountsController: IAccountsController = new AccountsController(accountService);

router.post('/', accountsController.addAccount.bind(accountsController));
router.put('/:accountId', accountsController.updateAccount.bind(accountsController));
router.delete('/:accountId', accountsController.removeAccount.bind(accountsController));
router.get('/', accountsController.getUserAccounts.bind(accountsController));
router.get('/balance', accountsController.getTotalBalance.bind(accountsController));
router.get('/bank-balance', accountsController.getTotalBankBalance.bind(accountsController));
router.get('/debt', accountsController.getTotalDebt.bind(accountsController));
router.get('/investment', accountsController.getTotalInvestment.bind(accountsController));

export default router;
