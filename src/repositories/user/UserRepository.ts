import IProfile from 'services/user/interfaces/IProfile';
import IUserRepository from './interfaces/IUserRepository';
import UserBaseRespository from 'repositories/base/UserBaseRespository';
import UserModel from 'model/user/model/UserModel';

class UserRepository extends UserBaseRespository implements IUserRepository {
    // Find user by user ID 
    async findByUserId(userId: string): Promise<IProfile | null> {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) return null;
        return { userId: user.id, firstName: user.first_name, lastName: user.last_name, phoneNumber: user.phone_number };
    }
}

export default UserRepository;
