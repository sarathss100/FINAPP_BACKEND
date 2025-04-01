import UserModel from 'model/user/model/UserModel';
import IAdminRepository from './interfaces/IAdminRepository';
import IUserDetails from './interfaces/IUserDetails';

class AdminRepository implements IAdminRepository {
    // Find All Users
    async findAllUsers(): Promise<IUserDetails[] | null> {
        const users = await UserModel.find({}).lean();
        const userDetails: IUserDetails[] = users.map((user) => ({
            userId: String(user._id),
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            status: user.status,
            role: user.role
        }));

        return userDetails;
    }

    // Handle toggling user status (block/unblock) for admin
    async toggleUserStatus(_id: string, status: boolean): Promise<boolean | null> {
        const updateResult = await UserModel.updateOne({ _id }, { $set: { status } });
        if (updateResult.modifiedCount > 0) return true;
        return false;
    }
}

export default AdminRepository;
