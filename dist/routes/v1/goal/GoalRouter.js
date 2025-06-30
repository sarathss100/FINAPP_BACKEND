"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GoalManagementRepository_1 = __importDefault(require("repositories/goal/GoalManagementRepository"));
const GoalService_1 = __importDefault(require("services/goal/GoalService"));
const GoalController_1 = __importDefault(require("controller/goal/GoalController"));
const router = (0, express_1.Router)();
const goalRepository = new GoalManagementRepository_1.default();
const goalService = new GoalService_1.default(goalRepository);
const goalController = new GoalController_1.default(goalService);
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
router.get('/summary/longest-period', goalController.findLongestTimePeriod.bind(goalController));
// Contribution analysis 
router.get('/contributions/daily', goalController.dailyContribution.bind(goalController));
router.get('/contributions/monthly', goalController.monthlyContribution.bind(goalController));
// Transaction management 
router.post('/:goalId/transactions', goalController.updateTransaction.bind(goalController));
exports.default = router;
