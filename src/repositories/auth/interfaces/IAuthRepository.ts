import { SignupDto } from 'dtos/auth/SignupDto';
import IAuthUser from '../../base/interfaces/IAuthUser';
import { ResetPasswordDto } from 'dtos/auth/ResetPasswordDto';
import IUser from 'dtos/base/UserDto';

interface IAuthRepository {
    createUser(data: SignupDto): Promise<IAuthUser>;
    findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null>;
    resetPassword(data: ResetPasswordDto): Promise<boolean | null>;
    restoreUserAccount(userId: string): Promise<void>;
    getUserDetails(userId: string): Promise<IUser>;
}

export default IAuthRepository;
