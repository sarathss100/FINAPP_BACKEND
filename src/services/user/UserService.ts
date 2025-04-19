import IUserRepository from 'repositories/user/interfaces/IUserRepository';
import IUserService from './interfaces/IUserService';
import IProfile from './interfaces/IProfile';
import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError, ServerError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import uploadToCloudinary from 'services/cloudinary/cloudinaryService';

class UserService implements IUserService {
    private _userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    async getUserProfileDetails(accessToken: string): Promise<IProfile> {
        try {
            // Decode and Validate the token
            const userId = decodeAndValidateToken(accessToken);

            const profileDetails = await this._userRepository.findByUserId(userId);
            if (!profileDetails) throw new AuthenticationError(ErrorMessages.FETCH_USER_PROFILE_FAILED, StatusCodes.BAD_REQUEST);

            return profileDetails;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateUserProfilePicture(file: Express.Multer.File, accessToken: string): Promise<string> {
        try {
            // Decode and validate the token
            const userId = decodeAndValidateToken(accessToken);

            if (!file || !file.buffer) throw new ValidationError(ErrorMessages.USER_PROFILE_PICTURE_MISSING_ERROR, StatusCodes.BAD_REQUEST);

            // Upload the image to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(file.buffer, file.originalname);

            // Save the Cloudinary URL in the database
            const isProfilePictureUpdated = await this._userRepository.updateUserProfileImageUrl(userId, cloudinaryUrl);

            if (!isProfilePictureUpdated) throw new ServerError(ErrorMessages.FAILED_TO_UPLOAD_PROFILE_PICTURE, StatusCodes.INTERNAL_SERVER_ERROR);

            return cloudinaryUrl; // Return the updated URL
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUserProfilePictureUrl(accessToken: string): Promise<string> {
        try {
            // Decode and validate the token
            const userId = decodeAndValidateToken(accessToken);

            // Extract the profile picture url from the database
            const profilePictureUrl = await this._userRepository.getUserProfileImageUrl(userId);

            if (!profilePictureUrl) throw new ServerError(ErrorMessages.FAILED_TO_FETCH_PROFILE_PICTURE_URL, StatusCodes.INTERNAL_SERVER_ERROR);

            return profilePictureUrl; // Return the URL 
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async toggleTwoFactorAuthentication(accessToken: string): Promise<boolean> {
        try {
            // Decode and validate the token
            const userId = decodeAndValidateToken(accessToken);

            // Toggle User Two Factor Authentcation (2FA) status for a user in the repository layer.
            const isToggled = await this._userRepository.toggleTwoFactorAuthentication(userId);

            return isToggled; // Return the Success status
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteUserAccount(accessToken: string): Promise<boolean> {
        try {
            // Decode and validate the token
            const userId = decodeAndValidateToken(accessToken);

            // Delete User Account for a user in the repository layer.
            const isDeleted = await this._userRepository.deleteUserAccount(userId);

            return isDeleted; // Return the Success status
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export default UserService;
