import { Router } from 'express';
import GoalManagementRepository from 'repositories/goal/GoalManagementRepository';
import GoalService from 'services/goal/GoalService';
import GoalController from 'controller/goal/GoalController';
import IGoalController from 'controller/goal/interfaces/IGoalController';

const router = Router();
const goalRepository = new GoalManagementRepository();
const goalService = new GoalService(goalRepository);
const goalController: IGoalController = new GoalController(goalService);

// Analysis & category
router.get('/analyze', goalController.analyzeGoal.bind(goalController));
router.get('/category', goalController.goalsByCategory.bind(goalController));

// CRUD operations
router.post('/', goalController.createGoal.bind(goalController));
router.get('/', goalController.getUserGoals.bind(goalController));
router.get('/:goalId', goalController.getGoalById.bind(goalController));
router.put('/:goalId', goalController.updateGoal.bind(goalController));
router.delete('/:goalId', goalController.removeGoal.bind(goalController));

// Summary routes 
router.get('/summary/total', goalController.getTotalActiveGoalAmount.bind(goalController));
router.get('/summary/initial/total', goalController.getTotalInitialGoalAmount.bind(goalController));
router.get('/summary/longest-period', goalController.findLongestTimePeriod.bind(goalController));

// Contribution analysis 
router.get('/contributions/daily', goalController.dailyContribution.bind(goalController));
router.get('/contributions/monthly', goalController.monthlyContribution.bind(goalController));

// Transaction management 
router.post('/:goalId/transactions', goalController.updateTransaction.bind(goalController));

export default router;
