import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import IProfileDTO from '../../dtos/user/IProfileDTO';
import { ServerError } from '../../error/AppError';
import UserMapper from '../../mappers/user/UserMapper';
import IUserRepository from '../../repositories/user/interfaces/IUserRepository';
import uploadToCloudinary, { deleteImage } from '../../services/cloudinary/cloudinaryService';
import { extractUserIdFromToken, wrapServiceError } from '../../utils/serviceUtils';
import generateUniqueId from '../../utils/user/generateUniqueId';
import IUserService from './interfaces/IUserService';

class UserService implements IUserService {
    private _userRepository: IUserRepository;
    
    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    /**
     * Helper method to construct proxy URLs safely
     * @param imageId - The image ID
     * @returns The properly formatted proxy URL
     */
    private getProxyImageUrl(imageId: string): string {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return `${baseUrl}/api/v1/user/images/${imageId}`;
    }

    async getUserProfileDetails(accessToken: string): Promise<IProfileDTO> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            const userDetails = await this._userRepository.getUserDetails(userId);

            const resultDTO = UserMapper.toIProfileDTO(userDetails);

            return resultDTO;
        } catch (error) {
            console.error('Error while getting user profile details: ', error);
            throw wrapServiceError(error);
        }
    }

    async updateUserProfilePicture(file: Express.Multer.File, accessToken: string): Promise<string> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            const userDetails = await this._userRepository.getUserDetails(userId);

            const resultDTO = UserMapper.toIProfilePictureDTO(userDetails);

            const currentCloudinaryUrl = resultDTO?.imageUrl;

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

            const proxyUrl = this.getProxyImageUrl(imageId);

            // Return proxy URL instead of direct Cloudinary URL 
            return proxyUrl;
        } catch (error) {
            console.error('Error while updating profile picture: ', error);
            throw wrapServiceError(error);
        }
    }

    async getUserProfilePictureUrl(accessToken: string): Promise<string> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Extract the profile picture url from the database
            const userDetails = await this._userRepository.getUserDetails(userId);

            const resultDTO = UserMapper.toIProfilePictureDTO(userDetails);

            if (!resultDTO.imageUrl) {
                // Return proxy URL for default image 
                return this.getProxyImageUrl('default');
            }

            const proxyUrl = this.getProxyImageUrl(resultDTO.imageId);

            // Return proxy URL instead of direct Cloudinary URL
            return proxyUrl;
        } catch (error) {
            console.error('Error while getting profile picture url: ', error);
            throw wrapServiceError(error);
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
            console.error('Error while getting image for proxy: ', error);
            throw wrapServiceError(error);
        }
    }

    async toggleTwoFactorAuthentication(accessToken: string): Promise<boolean> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Toggle User Two Factor Authentcation (2FA) status for a user in the repository layer.
            const isToggled = await this._userRepository.toggleTwoFactorAuthentication(userId);

            return isToggled;
        } catch (error) {
            console.error('Error while toggle two factor authentication: ', error);
            throw wrapServiceError(error);
        }
    }

    async deleteUserAccount(accessToken: string): Promise<boolean> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Delete User Account for a user in the repository layer.
            const isDeleted = await this._userRepository.deleteUserAccount(userId);

            return isDeleted;
        } catch (error) {
            console.error('Error while deleting account: ', error);
            throw wrapServiceError(error);
        }
    }

    async checkSubscriptionStatus(accessToken: string): Promise<boolean> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            // Delete User Account for a user in the repository layer.
            const userDetails = await this._userRepository.getUserDetails(userId);

            return !!userDetails.subscription_status;
        } catch (error) {
            console.error('Error while checking subscription status: ', error);
            throw wrapServiceError(error);
        }
    }
}

export default UserService;
