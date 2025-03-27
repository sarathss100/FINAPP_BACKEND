import { SignupDto } from 'dtos/auth/SignupDto';
import IAuthUser from './IAuthUser';

interface IUserRepository {
    createUser(data: SignupDto): Promise<IAuthUser>;
    findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null>;
}

export default IUserRepository;
