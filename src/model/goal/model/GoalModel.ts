import mongoose, { Model } from 'mongoose';
import IGoal from '../interfaces/IGoal';
import GoalSchema from '../schema/GoalSchema';

export const GoalModel: Model<IGoal> = mongoose.model<IGoal>('Goals', GoalSchema);

