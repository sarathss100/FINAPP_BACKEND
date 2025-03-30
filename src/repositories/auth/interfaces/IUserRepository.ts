import { SignupDto } from 'dtos/auth/SignupDto';
import IAuthUser from './IAuthUser';
import { ResetPasswordDto } from 'dtos/auth/ResetPasswordDto';

interface IUserRepository {
    createUser(data: SignupDto): Promise<IAuthUser>;
    findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null>;
    resetPassword(data: ResetPasswordDto): Promise<boolean | null>;
}

export default IUserRepository;
