import { Request, Response } from 'express';
import IUserService from 'services/user/interfaces/IUserService';
import IUserController from './interfaces/IUserController';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { StatusCodes } from 'constants/statusCodes';
import { AppError, AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { SuccessMessages } from 'constants/successMessages';

class UserController implements IUserController {
    private readonly _userService: IUserService;
    constructor(userService: IUserService) {
        this._userService = userService;
    }

    async getUserProfileDetails(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the verifyPhoneNumber method from AuthService
            const userProfileDetails = await this._userService.getUserProfileDetails(accessToken);
    
            if (userProfileDetails) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_PROFILE_FETCHED, {...userProfileDetails});
            }
            
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default UserController;
