import { SignupDto } from 'dtos/auth/SignupDto';
import { UserModel } from 'model/user/model/UserModel';
import IAuthUser from '../base/interfaces/IAuthUser';
import { ResetPasswordDto } from 'dtos/auth/ResetPasswordDto';
import UserBaseRespository from 'repositories/base/UserBaseRespository';
import IAuthRepository from './interfaces/IAuthRepository';

class AuthRepository extends UserBaseRespository implements IAuthRepository {
    // Create a new user
    async createUser(data: SignupDto): Promise<IAuthUser> {
        const user = await UserModel.create(data);
        return { userId: user.id, phoneNumber: user.phone_number, status: user.status, role: user.role };
    }

    // Reset Password user by phone number 
    async resetPassword(data: ResetPasswordDto): Promise<boolean | null> {
        const user = await UserModel.updateOne({ phone_number: data.phone_number }, { $set: { password: data.password } });
        if (!user) return null;
        return true;
    }
}

export default AuthRepository;
