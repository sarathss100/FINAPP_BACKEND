import { Router } from 'express';
import MutualFundRepository from 'repositories/mutualfunds/MutualFundRepository';
import MutualFundController from 'controller/mutualfunds/MutualFundController';
import MutualFundService from 'services/mutualfunds/MutualFundService';

const router = Router();
const mutualFundRepository = new MutualFundRepository();
const mutualFundService = new MutualFundService(mutualFundRepository);
const mutualFundController = new MutualFundController(mutualFundService);

// CRUD operations
router.post('/', mutualFundController.createTransaction.bind(mutualFundController));

export default router;
