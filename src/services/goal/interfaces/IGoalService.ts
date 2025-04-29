import { IGoalDTO } from 'dtos/goal/GoalDto';
import ISmartAnalysisResult from './ISmartAnalysisResult';
import IGoalCategory from './IGoalCategory';

interface IGoalService {
    createGoal(accessToken: string, goalData: IGoalDTO): Promise<IGoalDTO>;
    updateGoal(accessToken: string, goalId: string, goalData: Partial<IGoalDTO>): Promise<IGoalDTO>;
    removeGoal(goalId: string): Promise<boolean>;
    getUserGoals(accessToken: string): Promise<IGoalDTO[]>;
    getTotalActiveGoalAmount(accessToken: string): Promise<number>;
    findLongestTimePeriod(accessToken: string): Promise<string>;
    analyzeGoal(accessToken: string): Promise<ISmartAnalysisResult>;
    goalsByCategory(accessToken: string): Promise<IGoalCategory>;  
    dailyContribution(accessToken: string): Promise<number>;
    monthlyContribution(accessToken: string): Promise<number>;
    getGoalById(accessToken: string, goalId: string): Promise<IGoalDTO>;
    updateTransaction(accessToken: string, goalId: string, transactionData: { amount: number; transaction_id?: string; date?: Date }): Promise<boolean>;
}

export default IGoalService;
