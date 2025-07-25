import { Router } from 'express';
import IMutualFundController from '../../../controller/mutualfunds/interfaces/IMutualFundController';

const createMutualFundRouter = function(mutualFundController: IMutualFundController): Router {
    const router = Router();

    router.get('/nav', mutualFundController.syncNavData.bind(mutualFundController));
    router.get('/search', mutualFundController.searchMutualFunds.bind(mutualFundController));
    router.get('/', mutualFundController.getMutualFundDetails.bind(mutualFundController));

    return router;
};

export default createMutualFundRouter;