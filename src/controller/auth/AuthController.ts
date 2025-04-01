import { Request, Response } from 'express';
import IAuthController from './ineterfaces/IAuthController';
import IAuthService from 'services/auth/interfaces/IAuthService';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { StatusCodes } from 'utils/statusCodes';
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
            sendSuccessResponse(response, StatusCodes.CREATED, `User created successfully`, { userId, role });
        } catch (error) {
            let errorMessage = `Account creation failed due to a serer error. Please try again later or contact support`;
            if (error instanceof Error) {
                errorMessage = `An account with this Phone Number already exists. Please log in or use a different Phone Number.`;
            } 
            // Send a error response
            sendErrorResponse(response, StatusCodes.BAD_REQUEST, errorMessage);
        }
    }

    async verifyToken(request: Request, response: Response): Promise<void> {
        try {
            const authHeader: string | undefined = request.headers.cookie;
            const parsedAuthHeader = JSON.parse(authHeader!);
            const { accessToken } = parsedAuthHeader;
        
            if (!accessToken) {
                throw new Error(`Access Token Not found`);
            }

            const verificationStatus = await this._authService.verifyToken(accessToken);
            if (!verificationStatus) {
                throw new Error(`Verification Failed`);
            }
            
            sendSuccessResponse(response, StatusCodes.OK, `Valid Access Token`, { valid: true, message: `Valid Access Token` });
        } catch (error) {
            sendErrorResponse(response, StatusCodes.UNAUTHORIZED, error instanceof Error ? error.message : `Invalid or Expired Token`);
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
            sendSuccessResponse(response, StatusCodes.CREATED, `User created successfully`, { userId, role });
        } catch (error) {
            let errorMessage = `An unexpected Error occured while SignIn`;
            if (error instanceof Error) {
                errorMessage = error.message;
            } else  {
                errorMessage = `Invalid Phone Number or Password`;
            } 
            // Send a error response
            sendErrorResponse(response, StatusCodes.BAD_REQUEST, errorMessage);
        }
    }

    async signout(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new Error(`Access Token Not found!`);
            }

            // Call the signout method from AuthService
            const signoutStatus = await this._authService.signout(accessToken);
            if (!signoutStatus) {
                throw new Error(`An unexpected Error occured while try to sign out`);
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

            sendSuccessResponse(response, StatusCodes.OK, `User Signed out Successfully`);
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
                throw new Error(`Phone not found on the request`);
            }

            // Call the verifyPhoneNumber method from AuthService
            const isVerifiedPhoneNumber = await this._authService.verifyPhoneNumber(phoneNumber);
    
            if (!isVerifiedPhoneNumber) throw new Error(`Please Enter a Valid Phone Number`);
            
            sendSuccessResponse(response, StatusCodes.OK, `Phone Number Verified Successfully`);
        } catch (error) {
            let errorMessage = `An unexpected Error occured while verifying Phone Number`;
            if (error instanceof Error) {
                errorMessage = error.message;
            } 
            // Send error response
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        }
    }

    async resetPassword(request: Request, response: Response): Promise<void> {
        try {
            const data = request.body;

            // Call the verifyPhoneNumber method from AuthService
            const isPasswordResetted = await this._authService.resetPassword(data);
    
            if (!isPasswordResetted) throw new Error(`Failed to Reset the Password`);
            
            sendSuccessResponse(response, StatusCodes.OK, `Changed Password Successfully`);
        } catch (error) {
            let errorMessage = `Internal Server Error`;
            if (error instanceof Error) {
                errorMessage = error.message;
            } 
            // Send error response
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        }
    }
}
export default AuthController;
