import { Router } from 'express';
import InvestmentManagementRepository from 'repositories/investments/InvestmentManagementRepository';
import InvestmentService from 'services/investments/AccountService';
import InvestmentController from 'controller/investments/InvestmentController';
import IInvestmentController from 'controller/investments/interfaces/IInvestmentController';

const router = Router();
const investmentRepository = new InvestmentManagementRepository();
const investmentService = new InvestmentService(investmentRepository);
const investmentController: IInvestmentController = new InvestmentController(investmentService);

router.delete('/:accountId', investmentController.removeAccount.bind(investmentController));

export default router;

