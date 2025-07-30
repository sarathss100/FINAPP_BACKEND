import mongoose from 'mongoose';
import IGoalRepository from './interfaces/IGoalRepository';
import { GoalModel } from '../../model/goal/model/GoalModel';
import IGoalDocument from '../../model/goal/interfaces/IGoal';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import BaseRepository from '../base_repo/BaseRepository';

export default class GoalRepository implements IGoalRepository {
    private static _instance: GoalRepository;
    private baseRepo: IBaseRepository<IGoalDocument> = new BaseRepository<IGoalDocument>(GoalModel);

    public constructor() {};

    public static get instance(): GoalRepository {
        if (!GoalRepository._instance) {
            GoalRepository._instance = new GoalRepository();
        }
        return GoalRepository._instance;
    }

    async createGoal(goalData: Partial<IGoalDocument>): Promise<IGoalDocument> { 
        try {
            const result = await this.baseRepo.create(goalData);

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateGoal(goalId: string, goalData: Partial<IGoalDocument>): Promise<IGoalDocument> {
        try {
            const result = await this.baseRepo.updateOne({ _id: goalId }, {...goalData });

            if (!result) {
                throw new Error('Goal not found');
            }

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async removeGoal(goalId: string): Promise<IGoalDocument> {
        try {
            const result = await this.baseRepo.deleteOne({ _id: goalId });

            if (!result) {
                throw new Error('Goal not found');
            }

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUserGoals(userId: string): Promise<IGoalDocument[]> {
        try {
            const result = await this.baseRepo.find({ user_id: userId });

            if (!result || result.length === 0) {
                throw new Error('No goals found for the specified user');
            }

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getGoalById(goalId: string): Promise<IGoalDocument> {
        try {
            const result = await this.baseRepo.findById(goalId);

            if (!result) {
                throw new Error('No goal found for the specified ID');
            }

           return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateTransaction( goalId: string, transactionData: { amount: number; transaction_id?: string; date?: Date }): Promise<IGoalDocument> {
        try {
            const goal = await this.baseRepo.findOne({ _id: goalId });

            const newContribution = {
                transaction_id: transactionData.transaction_id
                    ? new mongoose.Types.ObjectId(transactionData.transaction_id)
                    : new mongoose.Types.ObjectId(),
                amount: transactionData.amount
            };

            let result: IGoalDocument | null;
            
            if (Number(goal?.current_amount) <= transactionData.amount) {
                result = await this.baseRepo.updateOne(
                    { _id: goalId },
                    {
                        $push: { contributions: newContribution },
                        $inc: { current_amount: -transactionData.amount },
                        $set: { is_completed: true }
                    }
                );
            } else {
                result = await this.baseRepo.updateOne(
                    { _id: goalId },
                    {
                        $push: { contributions: newContribution },
                        $inc: { current_amount: -transactionData.amount }
                    }
                );
            }

            if (!result || !result.user_id) {
                throw new Error('Failed to update goal');
            }
            
            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getGoalsForNotifyMonthlyGoalPayments(): Promise<IGoalDocument[]> {
        try {
            const goals = await this.baseRepo.find({ is_completed: false });

            return goals;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}


