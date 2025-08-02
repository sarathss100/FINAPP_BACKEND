import IAuthUserDTO from '../../../dtos/auth/IAuthUserDTO';
import IResetPasswordDTO from '../../../dtos/auth/IResetPasswordDTO';
import ISignupDTO from '../../../dtos/auth/ISignupDTO';
import IUserDTO from '../../../dtos/base/IUserDTO';
import ITokenPayload from '../../../dtos/auth/ITokenPayloadDTO';
import ISigninDTO from '../../../dtos/auth/ISigninDTO';

export default interface IAuthService {
    signup(signupData: ISignupDTO): Promise<IAuthUserDTO & { accessToken: string }>;
    signin(signinData: ISigninDTO): Promise<IAuthUserDTO & { accessToken: string }>;
    verifyToken(token: string): Promise<ITokenPayload>;
    verifyPhoneNumber(phoneNumber: string): Promise<boolean>;
    resetPassword(data: IResetPasswordDTO): Promise<boolean>;
    signout(token: string): Promise<boolean>;
    getUserDetails(accessToken: string): Promise<IUserDTO>;
    checkUserForSignup(phoneNumber: string): Promise<boolean>;
}
 