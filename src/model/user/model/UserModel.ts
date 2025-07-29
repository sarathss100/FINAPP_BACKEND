import mongoose, { Model } from 'mongoose';
import UserSchema from '../schema/userModel'; 
import IUserDocument from '../interfaces/IUser';

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);
