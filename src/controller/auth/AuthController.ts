import { Request, Response } from 'express';
import IAuthController from './ineterfaces/IAuthController';
import IAuthService from 'services/auth/interfaces/IAuthService';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { StatusCodes } from 'constants/statusCodes';
import { SuccessMessages } from 'constants/successMessages';
import { ErrorMessages } from 'constants/errorMessages';
import { AuthenticationError, ServerError } from 'error/AppError';
import { AppError } from 'error/AppError';
// import { httpOnlyCookieOptions } from 'utils/cookiesOptions';+---6

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
                maxAge: 15 * 60 * 1000,
            });

            // Set the user ID, role and LoggedIn state as an HTTP-only cookie
            response.cookie('userMetaData', JSON.stringify({ userId, role, isLoggedIn: true }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 15 * 60 * 1000,
            });

            // Send a success response
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.SIGNUP_SUCCESS, { userId, role });
        } catch (error) {
            let errorMessage: typeof ErrorMessages.INTERNAL_SERVER_ERROR = ErrorMessages.INTERNAL_SERVER_ERROR;
            if (error instanceof Error) {
                errorMessage = error.message as typeof ErrorMessages.INTERNAL_SERVER_ERROR;
            } 
            // Send a error response
            sendErrorResponse(response, StatusCodes.BAD_REQUEST, errorMessage);
        }
    }

    async verifyToken(request: Request, response: Response): Promise<void> {
        try {
            // Extract the cookie from the request headers
            const authHeader: string | undefined = request.headers.cookie;

            // Check if the cookie exists
            if (!authHeader) {
                throw new AuthenticationError(ErrorMessages.AUTH_COOKIE_MISSING);
            }
  
            // Parse the cookie to extract 
            const parsedAuthHeader = JSON.parse(authHeader!);
            const { accessToken } = parsedAuthHeader;
        
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND);
            }

            const verificationStatus = await this._authService.verifyToken(accessToken);
            if (!verificationStatus) {
                throw new AuthenticationError(ErrorMessages.TOKEN_VERIFICATION_FAILED);
            }
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TOKEN_VERIFIED, { valid: true, status: verificationStatus.status });
        } catch (error) {
            let errorMessage: typeof ErrorMessages.INTERNAL_SERVER_ERROR = ErrorMessages.INTERNAL_SERVER_ERROR;
            if (error instanceof Error) {
                errorMessage = error.message as typeof ErrorMessages.INTERNAL_SERVER_ERROR;
            } 
            // Send a error response
            sendErrorResponse(response, StatusCodes.BAD_REQUEST, errorMessage);
        }
    }

    async signin(request: Request, response: Response): Promise<void> {
        try {
            const signinData = request.body;
            
            // Call the signup method from AuthService
            const result = await this._authService.signin(signinData);

            // Extract the accessToken from the result
            const { accessToken, userId, role } = result;

            // Set the accessToken as an HTTP-only cookie
            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 15 * 60 * 1000,
            });

            // Cookie for user metadata 
            response.cookie('userMetaData', JSON.stringify({ userId, role, isLoggedIn: true }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 15 * 60 * 1000,
            });

            // Send a success response
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.SIGNIN_SUCCESS, { userId, role });
        } catch (error) {
            const errorMessage: string = (error as AppError).message || ErrorMessages.INTERNAL_SERVER_ERROR;
            const statusCode: number = (error as AppError).statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
            // Send a error response
            sendErrorResponse(response, statusCode, errorMessage);
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
            let errorMessage = `An unexpected Error occured while signing out`;
            
            if (error instanceof Error) {
                errorMessage = error.message;
            }
           
            // Send error response
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
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
    
            if (!isVerifiedPhoneNumber) throw new AuthenticationError(ErrorMessages.PHONE_NUMBER_MISSING, StatusCodes.BAD_REQUEST);
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.PHONE_NUMBER_VERIFIED);
        } catch (error) {
            let errorMessage: typeof ErrorMessages.INTERNAL_SERVER_ERROR = ErrorMessages.INTERNAL_SERVER_ERROR;
            if (error instanceof Error) {
                errorMessage = error.message as typeof ErrorMessages.INTERNAL_SERVER_ERROR;
            } 
            // Send a error response
            sendErrorResponse(response, StatusCodes.BAD_REQUEST, errorMessage);
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
            let errorMessage: typeof ErrorMessages.INTERNAL_SERVER_ERROR = ErrorMessages.INTERNAL_SERVER_ERROR;
            if (error instanceof Error) {
                errorMessage = error.message as typeof ErrorMessages.INTERNAL_SERVER_ERROR;
            } 
            // Send a error response
            sendErrorResponse(response, StatusCodes.BAD_REQUEST, errorMessage);
        }
    }
}

export default AuthController;
