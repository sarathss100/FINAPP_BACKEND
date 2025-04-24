import { Router } from 'express';
import GoalManagementRepository from 'repositories/goal/GoalManagementRepository';
import GoalService from 'services/goal/GoalService';
import GoalController from 'controller/goal/GoalController';
import IGoalController from 'controller/goal/interfaces/IGoalController';

const router = Router();
const goalRepository = new GoalManagementRepository();
const goalService = new GoalService(goalRepository);
const goalController: IGoalController = new GoalController(goalService);

router.post('/create', goalController.createGoal.bind(goalController));
router.post('/update', goalController.updateGoal.bind(goalController));
router.delete('/delete', goalController.removeGoal.bind(goalController));
router.get('/details', goalController.getUserGoals.bind(goalController));
router.get('/total-goal-amount', goalController.getTotalActiveGoalAmount.bind(goalController));
router.get('/longest-time-period', goalController.findLongestTimePeriod.bind(goalController));

export default router;
