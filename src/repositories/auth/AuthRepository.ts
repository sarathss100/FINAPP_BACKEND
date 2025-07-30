import UserBaseRespository from '../../repositories/base/UserBaseRespository';
import IAuthRepository from './interfaces/IAuthRepository';
import { ServerError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import IUserDocument from '../../model/user/interfaces/IUser';

export default class AuthRepository extends UserBaseRespository implements IAuthRepository {

    async createUser(data: Partial<IUserDocument>): Promise<IUserDocument> {
        try {
            const user = await this.baseRepo.create(data);

            return user;
        } catch (error) {
            throw new Error(`${(error as Error).message}`);
        }
    }
    
    async findByPhoneNumber(phoneNumber: string): Promise<IUserDocument> {
        try {
            const result = await this.baseRepo.findOne({ phone_number: phoneNumber });

            if (!result) {
                throw new Error(`User with Phone Number ${phoneNumber} not found`);
            }
            
            return result;
        } catch (error) {
            throw new Error(`${(error as Error).message}`);
        }
    }

    async resetPassword(data: Partial<IUserDocument>): Promise<boolean> {
        try {
            const result = await this.baseRepo.updateOne({ phone_number: data.phone_number }, { $set: { password: data.password } });

            if (!result) {
                throw new Error(`Failed Reset User Password`);
            }

            return true;
        } catch (error) {
            throw new Error(`${(error as Error).message}`);
        }
    }
    
    async restoreUserAccount(userId: string): Promise<void> { 
        try {
            const result = await this.baseRepo.updateOne({ _id: userId }, { $set: { isDeleted: false } });

            if (!result) {
                throw new ServerError(ErrorMessages.FAILED_TO_RESTORE_USER);
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
