import { Request, Response } from 'express';

export default interface IGoalController {
    createGoal(request: Request, response: Response): Promise<void>;
    updateGoal(request: Request, response: Response): Promise<void>;
    removeGoal(request: Request, response: Response): Promise<void>;
    getUserGoals(request: Request, response: Response): Promise<void>;
    getTotalActiveGoalAmount(request: Request, response: Response): Promise<void>;
    getTotalInitialGoalAmount(request: Request, response: Response): Promise<void>;
    findLongestTimePeriod(request: Request, response: Response): Promise<void>;
    analyzeGoal(request: Request, response: Response): Promise<void>;
    goalsByCategory(request: Request, response: Response): Promise<void>;
    dailyContribution(request: Request, response: Response): Promise<void>;
    monthlyContribution(request: Request, response: Response): Promise<void>;
    getGoalById(request: Request, response: Response): Promise<void>;
    updateTransaction(request: Request, response: Response): Promise<void>;
}
