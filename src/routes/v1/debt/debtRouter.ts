import { Router } from 'express';
import DebtManagementRepository from 'repositories/debt/DebtManagementRepository';
import DebtService from 'services/debt/DebtService';
import DebtController from 'controller/debt/DebtController';
import IDebtController from 'controller/debt/interfaces/IDebtController';

const router = Router();
const debtManagementRepository = new DebtManagementRepository();
const debtService = new DebtService(debtManagementRepository);
const debtController: IDebtController = new DebtController(debtService);

router.post('/', debtController.createDebt.bind(debtController));
router.get('/', debtController.getDebtCategorized.bind(debtController));
router.get('/all', debtController.getAllDebts.bind(debtController));
router.delete('/:id', debtController.deleteDebt.bind(debtController));
router.patch('/:id', debtController.markAsPaid.bind(debtController));
router.get('/total', debtController.getTotalDebt.bind(debtController));
router.get('/summary', debtController.getTotalOutstandingDebt.bind(debtController));
router.get('/monthly-payment', debtController.getTotalMonthlyPayment.bind(debtController));
router.get('/tenure', debtController.getLongestTenure.bind(debtController));
router.get('/simulation', debtController.getRepaymentStrategyComparison.bind(debtController));

export default router;
