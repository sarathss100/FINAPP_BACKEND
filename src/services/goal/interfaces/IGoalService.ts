import { IGoalDTO } from 'dtos/goal/GoalDto';

interface IGoalService {
    createGoal(accessToken: string, goalData: IGoalDTO): Promise<IGoalDTO>;
    updateGoal(accessToken: string, goalId: string, goalData: Partial<IGoalDTO>): Promise<IGoalDTO>;
    removeGoal(goalId: string): Promise<boolean>;
    getUserGoals(accessToken: string): Promise<IGoalDTO[]>;
}

export default IGoalService;
