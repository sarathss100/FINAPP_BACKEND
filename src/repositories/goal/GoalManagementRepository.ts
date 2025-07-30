import { IGoalDTO } from '../../dtos/goal/GoalDTO';
import IGoalManagementRepository from './interfaces/IGoalManagementRepository';
import { GoalModel } from '../../model/goal/model/GoalModel';
import mongoose from 'mongoose';

class GoalManagementRepository implements IGoalManagementRepository {
    private static _instance: GoalManagementRepository;

    public constructor() {};

    public static get instance(): GoalManagementRepository {
        if (!GoalManagementRepository._instance) {
            GoalManagementRepository._instance = new GoalManagementRepository();
        }
        return GoalManagementRepository._instance;
    }

    // Creates a new goal in the database and returns the created goal in IGoalDTO format.
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
                current_amount: result.current_amount,
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

    // Updates an existing goal in the database and returns the updated goal in IGoalDTO format.
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
                current_amount: result.current_amount,
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

    // Removes an existing goal from the database.
    async removeGoal(goalId: string): Promise<IGoalDTO> {
        try {
            // Perform the deletion operation
            const result = await GoalModel.findOneAndDelete({ _id: goalId }, { new: true });

            // Handle case where no goal is found
            if (!result) {
                throw new Error('Goal not found');
            }

            // Map the updated result to IGoalDTO format
            const removedGoal: IGoalDTO = {
                user_id: result.user_id.toString(),
                tenant_id: result.tenant_id?.toString(),
                goal_name: result.goal_name,
                goal_category: result.goal_category,
                target_amount: result.target_amount,
                initial_investment: result.initial_investment,
                current_amount: result.current_amount,
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

            return removedGoal;
        } catch (error) {
            console.error('Error updating goal:', error);
            throw new Error((error as Error).message);
        }
    }

    // Retrieves all goals associated with a specific user from the database.
    async getUserGoals(userId: string): Promise<IGoalDTO[]> {
        try {
            // Query the database to retrieve all goals associated with the given `userId`.
            const result = await GoalModel.find<IGoalDTO>({ user_id: userId });

            // it means no goals were found for the given user, and an error is thrown.
            if (!result || result.length === 0) {
                throw new Error('No goals found for the specified user');
            }

            const mappedData: IGoalDTO[] = result.map((data) => ({
                _id: data._id?.toString(),
                user_id: data.user_id?.toString(),
                tenant_id: data.tenant_id?.toString(),
                goal_name: data.goal_name,
                goal_category: data.goal_category,
                target_amount: data.target_amount,
                initial_investment: data.initial_investment,
                current_amount: data.current_amount,
                currency: data.currency,
                target_date: data.target_date,
                contribution_frequency: data.contribution_frequency,
                priority_level: data.priority_level,
                description: data.description,
                reminder_frequency: data.reminder_frequency,
                goal_type: data.goal_type,
                tags: data.tags,
                dependencies: data.dependencies?.map(dep => dep.toString()),
                is_completed: data.is_completed,
                created_by: data.created_by?.toString(),
                last_updated_by: data.last_updated_by?.toString(),
            }));

            // Return the retrieved goals as an array of `IGoalDTO` objects.
            return mappedData;
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving goal details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }

    // Retrieves a specific goal from the database based on its unique identifier.
    async getGoalById(goalId: string): Promise<IGoalDTO> {
        try {
            console.log(goalId)
            // Query the database to retrieve the goal associated with the given `goalId`.
            const result = await GoalModel.findOne<IGoalDTO>({ _id: goalId });

            // If no goal is found for the given `goalId`, throw an error.
            if (!result) {
                throw new Error('No goal found for the specified ID');
            }

            // Map the updated result to IGoalDTO format
            const updatedGoal: IGoalDTO = {
                _id: result._id?.toString(),
                user_id: result.user_id?.toString(),
                tenant_id: result.tenant_id?.toString(),
                goal_name: result.goal_name,
                goal_category: result.goal_category,
                target_amount: result.target_amount,
                initial_investment: result.initial_investment,
                current_amount: result.current_amount,
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
                created_by: result.created_by?.toString(),
                last_updated_by: result.last_updated_by?.toString(),
            };

            // Return the retrieved goal as an `IGoalDTO` object.
           return updatedGoal;
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving goal details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }

    // Updates a goal by recording a new contribution and deducting the transaction amount from the current goal amount
    async updateTransaction(
        goalId: string,
        transactionData: { amount: number; transaction_id?: string; date?: Date }
    ): Promise<IGoalDTO> {
        try {
            const goal = await GoalModel.findOne({ _id: goalId });
            const newContribution = {
                transaction_id: transactionData.transaction_id
                    ? new mongoose.Types.ObjectId(transactionData.transaction_id)
                    : new mongoose.Types.ObjectId(),
                amount: transactionData.amount
            };

            let result: IGoalDTO | null;
            
            if (Number(goal?.current_amount) <= transactionData.amount) {
                result = await GoalModel.findOneAndUpdate(
                    { _id: goalId },
                    {
                        $push: { contributions: newContribution },
                        $inc: { current_amount: -transactionData.amount },
                        $set: { is_completed: true }
                    }, 
                    {
                        new: true
                    }
                );
            } else {
                result = await GoalModel.findOneAndUpdate(
                    { _id: goalId },
                    {
                        $push: { contributions: newContribution },
                        $inc: { current_amount: -transactionData.amount }
                    }, 
                    {
                        new: true
                    }
                );
            }

            if (!result || !result.user_id) {
                throw new Error('Failed to update goal');
            }

            // Map the updated result to IGoalDTO format
            const updatedGoal: IGoalDTO = {
                user_id: result.user_id.toString(),
                tenant_id: result.tenant_id?.toString(),
                goal_name: result.goal_name,
                goal_category: result.goal_category,
                target_amount: result.target_amount,
                initial_investment: result.initial_investment,
                current_amount: result.current_amount,
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
                created_by: result.created_by?.toString(),
                last_updated_by: result.last_updated_by?.toString(),
            };
            
            return updatedGoal;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw new Error((error as Error).message);
        }
    }

    // Retrieves all active (non-completed) goals to check for monthly payment notifications.
    async getGoalsForNotifyMonthlyGoalPayments(): Promise<IGoalDTO[]> {
        try {
            // Fetch all non-completed goals from the database
            const goals = await GoalModel.find({ is_completed: false });

            // Map the raw database results to IGoalDTO format for consistent usage across the app
            const updatedGoals: IGoalDTO[] = goals.map((result) => ({
                user_id: result.user_id.toString(),
                tenant_id: result.tenant_id?.toString(),
                goal_name: result.goal_name,
                goal_category: result.goal_category,
                target_amount: result.target_amount,
                initial_investment: result.initial_investment,
                current_amount: result.current_amount,
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
            }));

            return updatedGoals;
        } catch (error) {
            console.error('Error fetching active goals for monthly payment notification:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default GoalManagementRepository;
