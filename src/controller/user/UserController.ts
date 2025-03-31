import { Request, Response } from 'express';
import IUserService from 'services/user/interfaces/IUserService';
import IUserController from './interfaces/IUserController';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { StatusCodes } from 'utils/statusCodes';

class UserController implements IUserController {
    private readonly _userService: IUserService;
    constructor(userService: IUserService) {
        this._userService = userService;
    }

    async getUserProfileDetails(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new Error(`AccessToken not found on the request`);
            }

            // Call the verifyPhoneNumber method from AuthService
            const userProfileDetails = await this._userService.getUserProfileDetails(accessToken);
    
            if (userProfileDetails) {
                sendSuccessResponse(response, StatusCodes.OK, `User profile details have been successfully retrieved.`, {...userProfileDetails});
            }
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            let errorMessage = `An unexpected error occurred while trying to fetch user profile details. Please try again later or contact support if the issue persists.`;
            // if (error instanceof Error) {
            //     errorMessage = error.message;
            // } 
            // Send error response
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        }
    }
}

export default UserController;
