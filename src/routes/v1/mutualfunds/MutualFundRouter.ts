import { Router } from 'express';
import MutualFundRepository from 'repositories/mutualfunds/MutualFundRepository';
import MutualFundController from 'controller/mutualfunds/MutualFundController';
import MutualFundService from 'services/mutualfunds/MutualFundService';
import IMutualFundController from 'controller/mutualfunds/interfaces/IMutualFundController';

const router = Router();
const mutualFundRepository = new MutualFundRepository();
const mutualFundService = new MutualFundService(mutualFundRepository);
const mutualFundController: IMutualFundController = new MutualFundController(mutualFundService);

// CRUD operations
router.get('/nav', mutualFundController.syncNavData.bind(mutualFundController));
router.get('/search', mutualFundController.searchMutualFunds.bind(mutualFundController));
router.get('/', mutualFundController.getMutualFundDetails.bind(mutualFundController));

export default router;
