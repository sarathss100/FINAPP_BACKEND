import mongoose, { Model } from 'mongoose';
import GoalSchema from '../schema/GoalSchema';
import IGoalDocument from '../interfaces/IGoal';

export const GoalModel: Model<IGoalDocument> = mongoose.model<IGoalDocument>('Goals', GoalSchema);

