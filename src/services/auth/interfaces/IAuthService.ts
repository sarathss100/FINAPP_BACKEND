import { SignupDto } from 'dtos/auth/SignupDto';
import IAuthUser from './IAuthUser';

interface IAuthService {
    signup(signupData: SignupDto): Promise<IAuthUser & { accessToken: string }>;
    verifyToken(token: string): Promise<void>;
}

export default IAuthService;
