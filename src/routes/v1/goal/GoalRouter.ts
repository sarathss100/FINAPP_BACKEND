import { Router } from 'express';
import IGoalController from '../../../controller/goal/interfaces/IGoalController';

const createGoalRouter = function(goalController: IGoalController): Router {
    const router = Router();

    router.get('/analyze', goalController.analyzeGoal.bind(goalController));
    router.get('/category', goalController.goalsByCategory.bind(goalController));
    router.post('/', goalController.createGoal.bind(goalController));
    router.get('/', goalController.getUserGoals.bind(goalController));
    router.get('/:goalId', goalController.getGoalById.bind(goalController));
    router.put('/:goalId', goalController.updateGoal.bind(goalController));
    router.delete('/:goalId', goalController.removeGoal.bind(goalController));
    router.get('/summary/total', goalController.getTotalActiveGoalAmount.bind(goalController));
    router.get('/summary/initial/total', goalController.getTotalInitialGoalAmount.bind(goalController));
    router.get('/summary/longest-period', goalController.findLongestTimePeriod.bind(goalController));
    router.get('/contributions/daily', goalController.dailyContribution.bind(goalController));
    router.get('/contributions/monthly', goalController.monthlyContribution.bind(goalController));
    router.post('/:goalId/transactions', goalController.updateTransaction.bind(goalController));

    return router;
};

export default createGoalRouter;