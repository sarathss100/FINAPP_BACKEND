import IProfile from 'services/user/interfaces/IProfile';
import IUserRepository from './interfaces/IUserRepository';
import UserBaseRespository from 'repositories/base/UserBaseRespository';
import { UserModel } from 'model/user/model/UserModel';

class UserRepository extends UserBaseRespository implements IUserRepository {
    // Find a user's profile information by their unique user ID.
    async findByUserId(userId: string): Promise<IProfile | null> {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) return null;
        return { userId: user.id, firstName: user.first_name, lastName: user.last_name, phoneNumber: user.phone_number };
    }

    // Updates the profile picture URL for a specific user in the database.
    async updateUserProfileImageUrl(userId: string, imageUrl: string): Promise<boolean> {
        const user = await UserModel.updateOne({ _id: userId }, { $set: { profile_picture_url: imageUrl } });
        return user.acknowledged;
    }

    // Retrieves the profile picture URL for a specific user in the database.
    async getUserProfileImageUrl(userId: string): Promise<string> {
        const user = await UserModel.findOne({ _id: userId }, { _id: 0, profile_picture_url: 1 });
        return user?.profile_picture_url || './user.png';
    }

    // Toggles the Two-Factor Authentication (2FA) status for a specific user in the database.
    async toggleTwoFactorAuthentication(userId: string, value: boolean): Promise<boolean> {
        const result = await UserModel.findByIdAndUpdate({ _id: userId }, { $set: { is2FA: value } });
        console.log(`User Repository`, result);
        return result ? true : false;
    }
}

export default UserRepository;
