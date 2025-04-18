import { IGoalDTO } from 'dtos/goal/GoalDto';
import IGoalManagementRepository from './interfaces/IGoalManagementRepository';
import { GoalModel } from 'model/goal/model/GoalModel';

class GoalManagementRepository implements IGoalManagementRepository {

    async createGoal(goalData: IGoalDTO): Promise<IGoalDTO> { 
        try {
            const result = await GoalModel.create({ goalData });

            const createdGoal: IGoalDTO = {
                user_id: result.user_id.toString(),
                tenant_id: result.tenant_id?.toString(),
                goal_name: result.goal_name,
                goal_category: result.goal_category,
                target_amount: result.target_amount,
                initial_investement: result.initial_investment,
                currency: result.currency,
                target_date: result.target_date,
                contribution_frequency: result.contribution_frequency,
                priority_level: result.priority_level,
                description: result.description,
                reminder_frequency: result.reminder_frequency,
                goal_type: result.goal_type,
                tags: result.tags,
                dependencies: result.dependencies?.map(dep => dep.toString()),
                is_completed: result.is_completed,
                created_by: result.created_by.toString(),
                last_updated_by: result.last_updated_by?.toString(),
            }
            
            return createdGoal;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export default GoalManagementRepository;
