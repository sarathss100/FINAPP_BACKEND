import { SignupDto } from 'dtos/auth/SignupDto';
import IAuthUser from './IAuthUser';
import { SigninDto } from 'dtos/auth/SigninDto';
import ITokenPayload from 'types/ITokenPayload';

interface IAuthService {
    signup(signupData: SignupDto): Promise<IAuthUser & { accessToken: string }>;
    signin(signinData: SigninDto): Promise<IAuthUser & { accessToken: string }>;
    verifyToken(token: string): Promise<ITokenPayload>;
    signout(token: string): Promise<boolean>;
}

export default IAuthService;
