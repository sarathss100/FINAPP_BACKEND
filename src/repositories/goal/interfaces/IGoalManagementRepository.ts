import { IGoalDTO } from 'dtos/goal/GoalDto';

interface IGoalManagementRepository {
    createGoal(goalData: IGoalDTO): Promise<IGoalDTO>;
    updateGoal(goalId: string, goalData: Partial<IGoalDTO>): Promise<IGoalDTO>;
    removeGoal(goalId: string): Promise<boolean>;
    getUserGoals(userId: string): Promise<IGoalDTO[]>;
    getGoalById(goalId: string): Promise<IGoalDTO>;
}

export default IGoalManagementRepository;
