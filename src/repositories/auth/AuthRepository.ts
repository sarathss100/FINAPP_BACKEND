import { SignupDto } from '../../dtos/auth/SignupDto';
import { UserModel } from '../../model/user/model/UserModel';
import IAuthUser from '../base/interfaces/IAuthUser';
import { ResetPasswordDto } from '../../dtos/auth/ResetPasswordDto';
import UserBaseRespository from '../../repositories/base/UserBaseRespository';
import IAuthRepository from './interfaces/IAuthRepository';
import { ServerError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import IUser from '../../dtos/base/UserDto';

class AuthRepository extends UserBaseRespository implements IAuthRepository {
    // Create a new user
    async createUser(data: SignupDto): Promise<IAuthUser> {
        const user = await UserModel.create(data);
        return { userId: user.id, phoneNumber: user.phone_number, status: user.status, role: user.role, is2FA: user.is2FA };
    }

    async getUserDetails(userId: string): Promise<IUser> {
        try {
            // Attempts to find the user document by `userId` and updates it to set the `isDeleted` field to `false`.
            const user = await UserModel.findOne({ _id: userId });

            const refinedUserDetails: IUser = {
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                phone_number: user?.phone_number || '',
                role: user?.role || '',
                status: user?.status || false,
                is2FA: user?.is2FA || false,
                isDeleted: user?.isDeleted || false,
                subscription_status: user?.subscription_status || false
            }
            
            return refinedUserDetails;
        } catch (error) {
            // Log the error for debugging purposes, including the `userId` to help trace the issue.
            console.error(`Error while fetching user account for user ID ${userId}:`, error);
            // Re-throw the error to allow upstream error handling mechanisms to manage the issue appropriately.
            throw error;
        }
    }

    // Reset Password user by phone number 
    async resetPassword(data: ResetPasswordDto): Promise<boolean | null> {
        const user = await UserModel.updateOne({ phone_number: data.phone_number }, { $set: { password: data.password } });
        if (!user) return null;
        return true;
    }
    
    // This function is responsible for restore the user account.
    async restoreUserAccount(userId: string): Promise<void> { 
        try {
            // Attempts to find the user document by `userId` and updates it to set the `isDeleted` field to `false`.
            const user = await UserModel.updateOne({ _id: userId }, { $set: { isDeleted: false } });

            // If fails to restore the user.
            if (!user.acknowledged) {
                throw new ServerError(ErrorMessages.FAILED_TO_RESTORE_USER);
            }

        } catch (error) {
            // Log the error for debugging purposes, including the `userId` to help trace the issue.
            console.error(`Error while restoring user account for user ID ${userId}:`, error);
            // Re-throw the error to allow upstream error handling mechanisms to manage the issue appropriately.
            throw error;
        }
    }
}

export default AuthRepository;
