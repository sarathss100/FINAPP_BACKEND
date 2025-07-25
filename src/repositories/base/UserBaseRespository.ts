import { UserModel } from '../../model/user/model/UserModel';
import IAuthUser from './interfaces/IAuthUser';
import IUserBaseRespository from './interfaces/IUserBaseRespository';
import IFaq from '../../model/admin/interfaces/IFaq';
import { FaqModel } from '../../model/admin/model/FaqModel';

class UserBaseRepository implements IUserBaseRespository {
    // Finds a user by their phone number.
    async findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null> {
        const user = await UserModel.findOne({ phone_number: phoneNumber });

        if (!user) return null;

        // Return sanitized user data conforming to IAuthUser interface
        return {
            userId: user.id,
            phoneNumber: user.phone_number,
            status: user.status,
            role: user.role,
            hashedPassword: user.password,
            is2FA: user.is2FA,
        };
    }

    // Toggles the Two-Factor Authentication (2FA) status for a specific user.
    async toggleTwoFactorAuthentication(userId: string): Promise<boolean> {
        try {
            // Fetch only the `is2FA` field of the user
            const user = await UserModel.findOne({ _id: userId }, { is2FA: 1 });

            if (!user) {
                throw new Error(`User with ID ${userId} not found.`);
            }

            // Toggle the current value of `is2FA`
            const newIs2FAValue = !user.is2FA;

            // Update the user document in the database
            const result = await UserModel.updateOne(
                { _id: userId },
                { $set: { is2FA: newIs2FAValue } }
            );

            if (result.modifiedCount === 0) {
                throw new Error(`Failed to update 2FA status for user ID ${userId}`);
            }

            // Return the new 2FA status
            return newIs2FAValue;
        } catch (error) {
            console.error(`Error toggling 2FA for user ID ${userId}:`, error);
            throw error; // Re-throw the error for upstream handling
        }
    }

    async updateSubscriptionStatus(userId: string): Promise<boolean> {
        try {
            // Fetch the user's current subscription status
            const user = await UserModel.findOne({ _id: userId }, { subscription_status: 1 });

            if (!user) {
                throw new Error(`User with ID ${userId} not found.`);
            }

            // Determine the new subscription status by toggling the current value
            const newSubscriptionStatus = !user.subscription_status;

            // Update the user's subscription status in the database
            const result = await UserModel.updateOne(
                { _id: userId },
                { $set: { subscription_status: newSubscriptionStatus } }
            );

            if (result.modifiedCount === 0) {
                throw new Error(`Failed to update subscription status for user ID ${userId}`);
            }

            // Return the updated subscription status
            return newSubscriptionStatus;
        } catch (error) {
            console.error(`Error updating subscription status for user ID ${userId}:`, error);
            throw error; // Re-throw the error for upstream handling
        }
    }

    // Fetches all FAQ entries from the database for administrative purposes.
    async getAllFaqs(): Promise<IFaqDTO[] | null> {
        try {
            const result = await FaqModel.find();

            if (result.length) {
                const mappedData: IFaqDTO[] = result.map((data) => ({
                    _id: data._id?.toString(),
                    question: data.question,
                    answer: data.answer,
                    isDeleted: data.isDeleted,
                    isPublished: data.isPublished,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt
                }));
                return mappedData;
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error fetching FAQs in Admin Repository:`, error);
            throw new Error(`Failed to fetch FAQs: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

export default UserBaseRepository;