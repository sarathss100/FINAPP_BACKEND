import { SignupDto } from 'dtos/auth/SignupDto';
import IAuthUser from './IAuthUser';
import { SigninDto } from 'dtos/auth/SigninDto';
import ITokenPayload from 'types/auth/ITokenPayload';
import { ResetPasswordDto } from 'dtos/auth/ResetPasswordDto';

interface IAuthService {
    signup(signupData: SignupDto): Promise<IAuthUser & { accessToken: string }>;
    signin(signinData: SigninDto): Promise<IAuthUser & { accessToken: string }>;
    verifyToken(token: string): Promise<ITokenPayload>;
    verifyPhoneNumber(phoneNumber: string): Promise<boolean>;
    resetPassword(data: ResetPasswordDto): Promise<boolean>;
    signout(token: string): Promise<boolean>;
}

export default IAuthService;
