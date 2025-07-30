import { UserModel } from '../../model/user/model/UserModel';
import IUserBaseRespository from './interfaces/IUserBaseRespository';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import IUserDocument from '../../model/user/interfaces/IUser';
import BaseRepository from '../base_repo/BaseRepository';

export default class UserBaseRepository implements IUserBaseRespository {
    public baseRepo: IBaseRepository<IUserDocument> = new BaseRepository<IUserDocument>(UserModel);

    async getUserDetails(userId: string): Promise<IUserDocument> {
        try {
            const result = await this.baseRepo.findById(userId);

            if (!result) {
                throw new Error(`User with ID ${userId} not found`);
            }
            
            return result;
        } catch (error) {
            throw new Error(`${(error as Error).message}`);
        }
    }
    
    async toggleTwoFactorAuthentication(userId: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ _id: userId }, { is2FA: 1 });

            if (!user) {
                throw new Error(`User with ID ${userId} not found.`);
            }

            // Toggle the current value of `is2FA`
            const newIs2FAValue = !user.is2FA;

            // Update the user document in the database
            const result = await this.baseRepo.updateOne(
                { _id: userId },
                { $set: { is2FA: newIs2FAValue } }
            );

            return !!result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateSubscriptionStatus(userId: string): Promise<boolean> {
        try {
            // Fetch the user's current subscription status
            const user = await UserModel.findOne({ _id: userId }, { subscription_status: 1 });

            if (!user) {
                throw new Error(`User with ID ${userId} not found.`);
            }

            // Determine the new subscription status by toggling the current value
            const newSubscriptionStatus = !user.subscription_status;

            // Update the user's subscription status in the database
            const result = await this.baseRepo.updateOne(
                { _id: userId },
                { $set: { subscription_status: newSubscriptionStatus } }
            );

            return !!result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}