import IProfile from 'services/user/interfaces/IProfile';
import IUserRepository from './interfaces/IUserRepository';
import UserBaseRespository from 'repositories/base/UserBaseRespository';
import { UserModel } from 'model/user/model/UserModel';
import { NotFoundError } from 'error/AppError';
import { Error } from 'mongoose';
import { ErrorMessages } from 'constants/errorMessages';

class UserRepository extends UserBaseRespository implements IUserRepository {
    // Find a user's profile information by their unique user ID.
    async findByUserId(userId: string): Promise<IProfile | null> {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) return null;
        return { userId: user.id, firstName: user.first_name, lastName: user.last_name, phoneNumber: user.phone_number, is2FA: user.is2FA, profilePictureUrl: user.profile_picture_url };
    }

    // Updates the profile picture URL for a specific user in the database.
    async updateUserProfileImageData(userId: string, imageUrl: string, imageId: string): Promise<boolean> {
        const user = await UserModel.updateOne({ _id: userId }, { $set: { profile_picture_url: imageUrl, profile_picture_id: imageId } });
        return user.acknowledged;
    }

    // Retrieves the profile picture URL for a specific user in the database.
    async getUserProfileImageData(userId: string): Promise<{ imageUrl: string; imageId: string } | null> {
        const user = await UserModel.findOne({ _id: userId }, { _id: 0, profile_picture_url: 1, profile_picture_id: 1 });
        if (!user?.profile_picture_url) return null;
        return { imageUrl: user.profile_picture_url, imageId: user.profile_picture_id };
    }

    // Get image URL by image ID (for proxy serving)
    async getImageUrlById(imageId: string): Promise<string | null> {
        const user = await UserModel.findOne(
            { profile_picture_id: imageId },
            { _id: 0, profile_picture_url: 1 }
        );
        return user?.profile_picture_url || null;
    }

    // Toggles the Two-Factor Authentication (2FA) status for a specific user in the database.
    async toggleTwoFactorAuthentication(userId: string): Promise<boolean> {
        try {
            // Fetch the current user document to get the current `is2FA` value
            const user = await UserModel.findOne({ _id: userId }, { is2FA: 1 });

            if (!user) {
                throw new Error(`User with ID ${userId} not found.`);
            }

            // Toggle the `is2FA` value
            const newIs2FAValue = !user.is2FA;

            // Update the database with the new `is2FA` value
            await UserModel.updateOne(   
            { _id: userId },
            { $set: { is2FA: newIs2FAValue } }
            );

            // Return the latest `is2FA` value
            return newIs2FAValue;
        } catch (error) {   
        console.error(`Error toggling 2FA for user ID ${userId}:`, error);
        throw error; // Re-throw the error for upstream handling
        }
    }

    // This function is responsible for marking a user account as deleted in the database.
    async deleteUserAccount(userId: string): Promise<boolean> { 
        try {
            // Attempts to find the user document by `userId` and updates it to set the `isDeleted` field to `true`.
            const user = await UserModel.updateOne({ _id: userId }, { $set: { isDeleted: true } });

            // If no user is found with the given `userId`, throw a `NotFoundError` with an appropriate error message.
            if (!user.acknowledged) {
                throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
            }

            // If the operation is successful, return `true` to indicate that the account deletion process was completed.
            return true;
        } catch (error) {
            // Log the error for debugging purposes, including the `userId` to help trace the issue.
            console.error(`Error while deleting user account for user ID ${userId}:`, error);
            // Re-throw the error to allow upstream error handling mechanisms to manage the issue appropriately.
            throw error;
        }
    }
}

export default UserRepository;
