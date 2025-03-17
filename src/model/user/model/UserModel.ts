import mongoose, { Model } from 'mongoose';
import UserSchema from '../schema/userModel'; 
import IUser from '../interfaces/IUser';

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
