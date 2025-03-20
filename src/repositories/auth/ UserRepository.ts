import { SignupDto } from 'dtos/auth/SignupDto';
import IUserRepository from './interfaces/IUserRepository';
import UserModel from 'model/user/model/UserModel';
import IAuthUser from 'services/auth/interfaces/IAuthUser';

class UserRepository implements IUserRepository {

    // Create a new user
    async createUser(data: SignupDto): Promise<IAuthUser> {
        const user = await UserModel.create(data);
        return { userId: user.id, phoneNumber: user.phone_number, status: 'Success' };
    }

    // Find user by phone number 
    async findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null> {
        const user = await UserModel.findOne({ phone_number: phoneNumber });
        if (!user) return null;
        return { userId: user.id, phoneNumber: user.phone_number, status: `Sucesss` };
    }
}

export default UserRepository;
