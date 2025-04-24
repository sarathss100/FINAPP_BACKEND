import { Request, Response } from 'express';

interface IGoalController {
    createGoal(request: Request, response: Response): Promise<void>;
    updateGoal(request: Request, response: Response): Promise<void>;
    removeGoal(request: Request, response: Response): Promise<void>;
    getUserGoals(request: Request, response: Response): Promise<void>;
    getTotalActiveGoalAmount(request: Request, response: Response): Promise<void>;
    findLongestTimePeriod(request: Request, response: Response): Promise<void>;
}

export default IGoalController;
