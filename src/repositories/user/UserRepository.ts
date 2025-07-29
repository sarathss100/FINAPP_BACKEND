import IUserRepository from './interfaces/IUserRepository';
import UserBaseRespository from '../../repositories/base/UserBaseRespository';
import { UserModel } from '../../model/user/model/UserModel';
import { NotFoundError } from '../../error/AppError';
import { Error } from 'mongoose';
import { ErrorMessages } from '../../constants/errorMessages';

export default class UserRepository extends UserBaseRespository implements IUserRepository {

    async updateUserProfileImageData(userId: string, imageUrl: string, imageId: string): Promise<boolean> {
        try {
            const result = await this.baseRepo.updateOne({ _id: userId }, { $set: { profile_picture_url: imageUrl, profile_picture_id: imageId } });

            return !!result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getImageUrlById(imageId: string): Promise<string> {
        try {
            const userDetails = await UserModel.findOne({ profile_picture_id: imageId },{ _id: 0, profile_picture_url: 1 });

            if (!userDetails) throw new Error(`Profile Picture Url Not found`);

            return userDetails.profile_picture_url || '';
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteUserAccount(userId: string): Promise<boolean> { 
        try {
            const user = await this.baseRepo.updateOne({ _id: userId }, { $set: { isDeleted: true } });

            if (!user) {
                throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
            }

            return true;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}