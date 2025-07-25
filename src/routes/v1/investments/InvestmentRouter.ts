import { Router } from 'express';
import IInvestmentController from '../../../controller/investments/interfaces/IInvestmentController';

const createInvestmentRouter = function(investmentController: IInvestmentController): Router {
    const router = Router();

    router.post('/', investmentController.createInvestment.bind(investmentController));
    router.get('/summary/total-invested', investmentController.totalInvestedAmount.bind(investmentController));
    router.get('/summary/current-value', investmentController.currentTotalValue.bind(investmentController));
    router.get('/summary/total-returns', investmentController.getTotalReturns.bind(investmentController));
    router.get('/categorized', investmentController.getCategorizedInvestments.bind(investmentController));
    router.post('/:investmentType/:investmentId',investmentController.removeInvestment.bind(investmentController));
    router.get('/stock', investmentController.searchStocks.bind(investmentController));

    return router;
};

export default createInvestmentRouter;

