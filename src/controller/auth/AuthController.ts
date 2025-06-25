import { Request, Response } from 'express';
import IAuthController from './ineterfaces/IAuthController';
import IAuthService from 'services/auth/interfaces/IAuthService';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { StatusCodes } from 'constants/statusCodes';
import { SuccessMessages } from 'constants/successMessages';
import { ErrorMessages } from 'constants/errorMessages';
import { AuthenticationError, ServerError } from 'error/AppError';
import { AppError } from 'error/AppError';
// import { httpOnlyCookieOptions } from 'utils/cookiesOptions';

class AuthController implements IAuthController {
    private readonly _authService: IAuthService;

    constructor(authService: IAuthService) {
        this._authService = authService;
    }

    async signup(request: Request, response: Response): Promise<void> {
        try {
            const signupData = request.body;
            
            // Call the signup method from AuthService
            const result = await this._authService.signup(signupData);

            // Extract the accessToken from the result
            const { accessToken, userId, role } = result;

            // Set the accessToken as an HTTP-only cookie
            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });

            // Set the user ID, role and LoggedIn state as an HTTP-only cookie
            response.cookie('userMetaData', JSON.stringify({ userId, role, isLoggedIn: true }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });

            // Send a success response
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.SIGNUP_SUCCESS, { userId, role });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async verifyToken(request: Request, response: Response): Promise<void> {
        try {
            // Extract the cookie from the request headers
            const authHeader: string | undefined = request.headers.cookie;

            // Check if the cookie exists
            if (!authHeader) {
                throw new AuthenticationError(ErrorMessages.AUTH_COOKIE_MISSING, StatusCodes.UNAUTHORIZED);
            }
  
            // Parse the cookie to extract 
            const parsedAuthHeader = JSON.parse(authHeader!);
            const { accessToken } = parsedAuthHeader;
        
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const verificationStatus = await this._authService.verifyToken(accessToken);
            if (!verificationStatus) {
                throw new AuthenticationError(ErrorMessages.TOKEN_VERIFICATION_FAILED, StatusCodes.UNAUTHORIZED);
            }
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TOKEN_VERIFIED, { valid: true, status: verificationStatus.status });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async signin(request: Request, response: Response): Promise<void> {
        try {
            const signinData = request.body;
            
            // Call the signup method from AuthService
            const result = await this._authService.signin(signinData);

            // Extract the accessToken from the result
            const { accessToken, userId, role, is2FA } = result;

            // Set the accessToken as an HTTP-only cookie
            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });

            // Cookie for user metadata 
            response.cookie('userMetaData', JSON.stringify({ userId, role, isLoggedIn: true }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });

            // Send a success response
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.SIGNIN_SUCCESS, { userId, role, is2FA });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async signout(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the signout method from AuthService
            const signoutStatus = await this._authService.signout(accessToken);
            if (!signoutStatus) {
                throw new ServerError(ErrorMessages.SIGNOUT_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            response.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });

            response.clearCookie('userMetaData', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.SIGNOUT_SUCCESS);
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async verifyPhoneNumber(request: Request, response: Response): Promise<void> {
        try {
            const { phoneNumber } = request.body;

            if (!phoneNumber) {
                throw new AuthenticationError(ErrorMessages.PHONE_NUMBER_MISSING, StatusCodes.BAD_REQUEST);
            }

            // Call the verifyPhoneNumber method from AuthService
            const isVerifiedPhoneNumber = await this._authService.verifyPhoneNumber(phoneNumber);
            if (!isVerifiedPhoneNumber) throw new AuthenticationError(ErrorMessages.USER_NOT_FOUND, StatusCodes.BAD_REQUEST);
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.PHONE_NUMBER_VERIFIED);
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async resetPassword(request: Request, response: Response): Promise<void> {
        try {
            const data = request.body;

            // Call the verifyPhoneNumber method from AuthService
            const isPasswordResetted = await this._authService.resetPassword(data);
            if (!isPasswordResetted) throw new ServerError(ErrorMessages.PASSWORD_RESET_FAILED, StatusCodes.BAD_REQUEST);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.PASSWORD_RESET_SUCCESS);
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default AuthController;
