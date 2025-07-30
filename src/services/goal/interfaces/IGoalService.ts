import IGoalDTO from '../../../dtos/goal/GoalDTO';
import ISmartAnalysisResult from '../../../dtos/goal/ISmartAnalysisResultDTO';
import IGoalCategory from '../../../dtos/goal/IGoalCategoryDTO';

export default interface IGoalService {
    createGoal(accessToken: string, goalData: IGoalDTO): Promise<IGoalDTO>;
    updateGoal(accessToken: string, goalId: string, goalData: Partial<IGoalDTO>): Promise<IGoalDTO>;
    removeGoal(goalId: string): Promise<boolean>;
    getUserGoals(accessToken: string): Promise<IGoalDTO[]>;
    getTotalActiveGoalAmount(accessToken: string): Promise<number>;
    getTotalInitialGoalAmount(accessToken: string): Promise<number>;
    findLongestTimePeriod(accessToken: string): Promise<string>;
    analyzeGoal(accessToken: string): Promise<ISmartAnalysisResult>;
    goalsByCategory(accessToken: string): Promise<IGoalCategory>;  
    dailyContribution(accessToken: string): Promise<number>;
    monthlyContribution(accessToken: string): Promise<number>;
    getGoalById(accessToken: string, goalId: string): Promise<IGoalDTO>;
    updateTransaction(accessToken: string, goalId: string, transactionData: { amount: number; transaction_id?: string; date?: Date }): Promise<boolean>;
    getGoalsForNotifyMonthlyGoalPayments(): Promise<IGoalDTO[]>;
}
