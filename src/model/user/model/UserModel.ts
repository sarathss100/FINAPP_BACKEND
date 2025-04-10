import mongoose, { Model } from 'mongoose';
import UserSchema from '../schema/userModel'; 
import IUser from '../interfaces/IUser';
import IGoal from '../interfaces/IGoal';
import GoalSchema from '../schema/goalModel';

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export const GoalModel: Model<IGoal> = mongoose.model<IGoal>('Goal', GoalSchema);
