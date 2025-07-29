import { Request, Response } from 'express';
import IAuthController from './ineterfaces/IAuthController';
import IAuthService from '../../services/auth/interfaces/IAuthService';
import { sendSuccessResponse } from '../../utils/responseHandler';
import { StatusCodes } from '../../constants/statusCodes';
import { SuccessMessages } from '../../constants/successMessages';
import { ErrorMessages } from '../../constants/errorMessages';
import { AuthenticationError, ServerError } from '../../error/AppError';
import { handleControllerError } from '../../utils/controllerUtils';

export default class AuthController implements IAuthController {
    private readonly _authService: IAuthService;

    constructor(authService: IAuthService) {
        this._authService = authService;
    }

    async signup(request: Request, response: Response): Promise<void> {
        try {
            const signupData = request.body;
            
            const result = await this._authService.signup(signupData);

            const { accessToken, userId, role } = result;

            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.finapp.my' : undefined,
                path: '/'
            });

            response.cookie('userMetaData', JSON.stringify({ userId, role, isLoggedIn: true }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.finapp.my' : undefined,
                path: '/'
            });

            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.SIGNUP_SUCCESS, { userId, role });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async verifyToken(request: Request, response: Response): Promise<void> {
        try {
            const authHeader: string | undefined = request.headers.cookie;

            if (!authHeader) {
                throw new AuthenticationError(ErrorMessages.AUTH_COOKIE_MISSING, StatusCodes.UNAUTHORIZED);
            }
  
            const parsedAuthHeader = JSON.parse(authHeader!);
            const { accessToken } = parsedAuthHeader;
        
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const verificationStatus = await this._authService.verifyToken(accessToken);
            if (!verificationStatus) {
                throw new AuthenticationError(ErrorMessages.TOKEN_VERIFICATION_FAILED, StatusCodes.UNAUTHORIZED);
            }

            const userDetails = await this._authService.getUserDetails(accessToken);
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TOKEN_VERIFIED, { valid: true, status: verificationStatus.status, subscription_status: userDetails.subscription_status });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async signin(request: Request, response: Response): Promise<void> {
        try {
            const signinData = request.body;
            
            const result = await this._authService.signin(signinData);

            const { accessToken, userId, role, is2FA } = result;

            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.finapp.my' : undefined,
                path: '/'
            });

            response.cookie('userMetaData', JSON.stringify({ userId, role, isLoggedIn: true }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.finapp.my' : undefined,
                path: '/'
            });

            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.SIGNIN_SUCCESS, { userId, role, is2FA });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async signout(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const signoutStatus = await this._authService.signout(accessToken);
            if (!signoutStatus) {
                throw new ServerError(ErrorMessages.SIGNOUT_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            response.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.finapp.my' : undefined,
                path: '/'
            });

            response.clearCookie('userMetaData', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.finapp.my' : undefined,
                path: '/'
            });

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.SIGNOUT_SUCCESS);
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async verifyPhoneNumber(request: Request, response: Response): Promise<void> {
        try {
            const { phoneNumber } = request.body;
            if (!phoneNumber) {
                throw new AuthenticationError(ErrorMessages.PHONE_NUMBER_MISSING, StatusCodes.BAD_REQUEST);
            }

            const isVerifiedPhoneNumber = await this._authService.verifyPhoneNumber(phoneNumber);
            if (!isVerifiedPhoneNumber) throw new AuthenticationError(ErrorMessages.USER_NOT_FOUND, StatusCodes.BAD_REQUEST);
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.PHONE_NUMBER_VERIFIED);
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async resetPassword(request: Request, response: Response): Promise<void> {
        try {
            const data = request.body;

            const isPasswordResetted = await this._authService.resetPassword(data);
            if (!isPasswordResetted) throw new ServerError(ErrorMessages.PASSWORD_RESET_FAILED, StatusCodes.BAD_REQUEST);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.PASSWORD_RESET_SUCCESS);
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}
 
