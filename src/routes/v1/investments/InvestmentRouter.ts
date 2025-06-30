import { Router } from 'express';
import InvestmentManagementRepository from 'repositories/investments/InvestmentManagementRepository';
import InvestmentService from 'services/investments/InvestmentService';
import InvestmentController from 'controller/investments/InvestmentController';
import IInvestmentController from 'controller/investments/interfaces/IInvestmentController';

const router = Router();
const investmentRepository = new InvestmentManagementRepository();
const investmentService = new InvestmentService(investmentRepository);
const investmentController: IInvestmentController = new InvestmentController(investmentService);

// CRUD 
router.post('/', investmentController.createInvestment.bind(investmentController));
router.get('/summary/total-invested', investmentController.totalInvestedAmount.bind(investmentController));
router.get('/summary/current-value', investmentController.currentTotalValue.bind(investmentController));

// Search
router.get('/stock', investmentController.searchStocks.bind(investmentController));

export default router;

