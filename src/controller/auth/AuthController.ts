import { Request, Response } from 'express';
import IAuthController from './IAuthController';
import IAuthService from 'services/auth/interfaces/IAuthService';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { StatusCodes } from 'utils/statusCodes';

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
            const { accessToken } = result;

            // Set the accessToken as an HTTP-only cookie
            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            // Send a success response
            sendSuccessResponse(response, StatusCodes.CREATED, `User created successfully`, { userId: result.userId, role: result.role });
        } catch (error) {
            // Send a error response
            sendErrorResponse(response, StatusCodes.BAD_REQUEST, error instanceof Error ? error.message : `An error occured during signup`);
        }
    }

    async verifyToken(request: Request, response: Response): Promise<void> {
        console.log(`verifyToken: request comes here`);
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new Error(`Access Token Not found in Cookies`);
            }

            await this._authService.verifyToken(accessToken);

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
            const { accessToken } = result;

            // Set the accessToken as an HTTP-only cookie
            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            // Send a success response
            sendSuccessResponse(response, StatusCodes.CREATED, `User created successfully`, { userId: result.userId, role: result.role });
        } catch (error) {
            let errorMessage = `An unexpected Error occured while SignIn`;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            // Send a error response
            sendErrorResponse(response, StatusCodes.BAD_REQUEST, errorMessage);
        }
    }
}

export default AuthController;
