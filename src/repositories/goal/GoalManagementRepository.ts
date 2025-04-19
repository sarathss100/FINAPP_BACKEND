import { IGoalDTO } from 'dtos/goal/GoalDto';
import IGoalManagementRepository from './interfaces/IGoalManagementRepository';
import { GoalModel } from 'model/goal/model/GoalModel';

class GoalManagementRepository implements IGoalManagementRepository {
    /**
    * Creates a new goal in the database and returns the created goal in IGoalDTO format.
    * 
    * This method takes an input object (`goalData`) containing goal details, inserts it into the database using the `GoalModel`,
    * and maps the result to the `IGoalDTO` format. MongoDB ObjectIds are converted to strings for consistency in the DTO.
    * 
    * @param {IGoalDTO} goalData - The input data representing the goal to be created. Must conform to the IGoalDTO structure.
    * @returns {Promise<IGoalDTO>} - A promise resolving to the created goal in IGoalDTO format, with ObjectIds converted to strings.
    * @throws {Error} - Throws an error if the database operation fails or if invalid data is provided.
    */
    async createGoal(goalData: IGoalDTO): Promise<IGoalDTO> { 
        try {
            const result = await GoalModel.create(goalData);
            const createdGoal: IGoalDTO = {
                user_id: result.user_id.toString(),
                tenant_id: result.tenant_id?.toString(),
                goal_name: result.goal_name,
                goal_category: result.goal_category,
                target_amount: result.target_amount,
                initial_investment: result.initial_investment,
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
            };
            return createdGoal;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    /**
    * Updates an existing goal in the database and returns the updated goal in IGoalDTO format.
    * 
    * This method takes an input object (`goalData`) containing updated goal details, finds the goal by `user_id`,
    * and updates it in the database using the `GoalModel`. The updated result is mapped to the `IGoalDTO` format,
    * with MongoDB ObjectIds converted to strings for consistency.
    * 
     * @param {IGoalDTO} goalData - The input data representing the goal to be updated. Must include `user_id` to identify the goal.
    * @returns {Promise<IGoalDTO>} - A promise resolving to the updated goal in IGoalDTO format, with ObjectIds converted to strings.
    * @throws {Error} - Throws an error if the database operation fails, the goal is not found, or invalid data is provided.
    */
    async updateGoal(goalId: string, goalData: Partial<IGoalDTO>): Promise<IGoalDTO> {
        try {
            // Perform the update operation
            const result = await GoalModel.findOneAndUpdate(
                { _id: goalId }, 
                { ...goalData }, 
                { new: true }   
            );

            // Handle case where no goal is found
            if (!result) {
                throw new Error('Goal not found');
            }

            // Map the updated result to IGoalDTO format
            const updatedGoal: IGoalDTO = {
                user_id: result.user_id.toString(),
                tenant_id: result.tenant_id?.toString(),
                goal_name: result.goal_name,
                goal_category: result.goal_category,
                target_amount: result.target_amount,
                initial_investment: result.initial_investment,
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
            };

            return updatedGoal;
        } catch (error) {
            console.error('Error updating goal:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
    * Removes an existing goal from the database.
    * 
    * @param {string} goalId - The unique identifier of the goal to be removed.
    * @returns {Promise<boolean>} - A promise resolving to `true` if the goal was successfully removed.
    * @throws {Error} - Throws an error if the database operation fails or the goal is not found.
    */
    async removeGoal(goalId: string): Promise<boolean> {
        try {
            // Perform the deletion operation
            const result = await GoalModel.findOneAndDelete({ _id: goalId }, { new: true });

            // Handle case where no goal is found
            if (!result) {
                throw new Error('Goal not found');
            }

            return true;
        } catch (error) {
            console.error('Error updating goal:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all goals associated with a specific user from the database.
     * 
     * @param {string} userId - The unique identifier of the user whose goals are being retrieved.
     * @returns {Promise<IGoalDTO[]>} - A promise resolving to an array of `IGoalDTO` objects representing the user's goals.
     * @throws {Error} - Throws an error if the database operation fails or no goals are found for the given user.
     */
    async getUserGoals(userId: string): Promise<IGoalDTO[]> {
        try {
            // Query the database to retrieve all goals associated with the given `userId`.
            const result = await GoalModel.find<IGoalDTO>({ user_id: userId });

            // it means no goals were found for the given user, and an error is thrown.
            if (!result || result.length === 0) {
                throw new Error('No goals found for the specified user');
            }

            // Return the retrieved goals as an array of `IGoalDTO` objects.
            return result;
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving goal details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }
}

export default GoalManagementRepository;
