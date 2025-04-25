import { IGoalDTO } from 'dtos/goal/GoalDto';
import ISmartAnalysisResult from './ISmartAnalysisResult';

interface IGoalService {
    createGoal(accessToken: string, goalData: IGoalDTO): Promise<IGoalDTO>;
    updateGoal(accessToken: string, goalId: string, goalData: Partial<IGoalDTO>): Promise<IGoalDTO>;
    removeGoal(goalId: string): Promise<boolean>;
    getUserGoals(accessToken: string): Promise<IGoalDTO[]>;
    getTotalActiveGoalAmount(accessToken: string): Promise<number>;
    findLongestTimePeriod(accessToken: string): Promise<string>;
    analyzeGoal(accessToken: string): Promise<ISmartAnalysisResult>;
}

export default IGoalService;
