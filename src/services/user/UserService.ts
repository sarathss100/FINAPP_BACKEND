import IUserRepository from '../../repositories/user/interfaces/IUserRepository';
import IUserService from './interfaces/IUserService';
import IProfile from './interfaces/IProfile';
import { decodeAndValidateToken } from '../../utils/auth/tokenUtils';
import { AuthenticationError, ServerError, ValidationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import uploadToCloudinary, { deleteImage } from '../../services/cloudinary/cloudinaryService';
import generateUniqueId from '../../utils/user/generateUniqueId';

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

            // Get Current Cloudinary UserId 
            const imageData = await this._userRepository.getUserProfileImageData(userId);
            const currentCloudinaryUrl = imageData?.imageUrl;

            if (currentCloudinaryUrl) {
                // Delete the current profile picture 
                await deleteImage(currentCloudinaryUrl);
            }

            // Upload the image to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(file.buffer, file.originalname);

            // Generate unique image ID 
            const imageId = generateUniqueId();

            // Save the Cloudinary URL in the database
            const isProfilePictureUpdated = await this._userRepository.updateUserProfileImageData(userId, cloudinaryUrl, imageId);

            if (!isProfilePictureUpdated) throw new ServerError(ErrorMessages.FAILED_TO_UPLOAD_PROFILE_PICTURE, StatusCodes.INTERNAL_SERVER_ERROR);

            // Return proxy URL instead of direct Cloudinary URL 
            const proxyUrl = `${process.env.BASE_URL}/api/user/images/${imageId}`;
            return proxyUrl;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUserProfilePictureUrl(accessToken: string): Promise<string> {
        try {
            // Decode and validate the token
            const userId = decodeAndValidateToken(accessToken);

            // Extract the profile picture url from the database
            const imageData = await this._userRepository.getUserProfileImageData(userId);

            if (!imageData) {
                // Return proxy URL for default image 
                return `${process.env.BASE_URL}/api/user/images/default`;
            }

            // Return proxy URL
            const proxyUrl = `${process.env.BASE_URL}/api/v1/user/images/${imageData.imageId}`;
            return proxyUrl;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getImageForProxy(imageId: string): Promise<Buffer | string> {
        try {
            let imageUrl: string;

            if (imageId === 'default') {
                // Handle default image
                imageUrl = '';
                return imageUrl;
            } else {
                // Get actual Cloudinary URL from database 
                const fetchedImageUrl = await this._userRepository.getImageUrlById(imageId);

                if (!fetchedImageUrl) {
                    throw new Error(`Image not found`);
                }
                
                imageUrl = fetchedImageUrl;
            }

            // Fetch image from Cloudinary
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
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
