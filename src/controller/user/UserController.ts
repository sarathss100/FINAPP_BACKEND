import { Request, Response } from 'express';
import IUserService from 'services/user/interfaces/IUserService';
import IUserController from './interfaces/IUserController';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { StatusCodes } from 'constants/statusCodes';
import { AppError, AuthenticationError, ServerError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { SuccessMessages } from 'constants/successMessages';

class UserController implements IUserController {
    private readonly _userService: IUserService;
  
    constructor(userService: IUserService ) {
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

    async uploadProfilePicture(request: Request, response: Response): Promise<void> {
        try {
            const file = request.file; // Multer provides the file object
            const { accessToken } = request.cookies;
            if (!file) {
                throw new ValidationError(ErrorMessages.USER_PROFILE_PICTURE_MISSING_ERROR, StatusCodes.BAD_REQUEST);
            }

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Extract the file path and pass it to the service layer
            const updatedProfilePictureUrl = await this._userService.updateUserProfilePicture(file, accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_PROFILE_PICTURE_UPLOADED, { profilePictureUrl: updatedProfilePictureUrl } ); 
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getUserProfilePictureUrl(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Extract the file path 
            const userProfilePictureUrl = await this._userService.getUserProfilePictureUrl(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_PROFILE_PICTURE_URL_FETCHED, { userProfilePictureUrl }); 
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async toggleTwoFactorAuthentication(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Extract the file path 
            const isToggled = await this._userService.toggleTwoFactorAuthentication(accessToken);
            

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.SUCCESSFULLY_TOGGLED_2FA, { isToggled });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async deleteUserAccount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Extract the file path 
            const isDeleted = await this._userService.deleteUserAccount(accessToken);

            if (!isDeleted) {
                throw new ServerError(ErrorMessages.FAILED_TO_DELETE_USER);
            }
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_ACCOUNT_DElETED, { isDeleted });
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
