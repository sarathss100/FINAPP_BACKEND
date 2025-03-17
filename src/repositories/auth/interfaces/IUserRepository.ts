import { SignupDto } from 'dtos/auth/SignupDto';
import IAuthUser from 'services/auth/interfaces/IAuthUser';

interface IUserRepository {
    createUser(data: SignupDto): Promise<IAuthUser>;
    findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null>;
}

export default IUserRepository;
