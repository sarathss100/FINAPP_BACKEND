import { Router } from 'express';
import IDebtController from '../../../controller/debt/interfaces/IDebtController';

const createDebtRouter = function(debtController: IDebtController): Router {
    const router = Router();

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

    return router;
};

export default createDebtRouter;