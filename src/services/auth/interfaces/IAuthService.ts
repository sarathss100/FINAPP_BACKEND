import { SignupDto } from 'dtos/auth/SignupDto';
import IAuthUser from './IAuthUser';

interface IAuthService {
    signup(signupData: SignupDto): Promise<IAuthUser>;
}

export default IAuthService;
