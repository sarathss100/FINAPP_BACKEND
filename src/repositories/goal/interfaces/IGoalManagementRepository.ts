import { IGoalDTO } from 'dtos/goal/GoalDto';

interface IGoalManagementRepository {
    createGoal(goalData: IGoalDTO): Promise<IGoalDTO>;
}

export default IGoalManagementRepository;
