import { IGoalDTO } from 'dtos/goal/GoalDto';

interface IGoalManagementRepository {
    createGoal(goalData: IGoalDTO): Promise<IGoalDTO>;
    updateGoal(goalId: string, goalData: Partial<IGoalDTO>): Promise<IGoalDTO>;
    removeGoal(goalId: string): Promise<boolean>;
    getUserGoals(userId: string): Promise<IGoalDTO[]>;
    getGoalById(goalId: string): Promise<IGoalDTO>;
    updateTransaction(goalId: string, transactionData: { amount: number; transaction_id?: string; date?: Date}): Promise<boolean>;
}

export default IGoalManagementRepository;
