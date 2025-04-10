import { UserModel } from 'model/user/model/UserModel';
import IAuthUser from './interfaces/IAuthUser';
import IUserBaseRespository from './interfaces/IUserBaseRespository';

class UserBaseRespository implements IUserBaseRespository {
    // Find user by phone number 
    async findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null> {
        const user = await UserModel.findOne({ phone_number: phoneNumber });
        if (!user) return null;
        return { userId: user.id, phoneNumber: user.phone_number, status: user.status, role: user.role, hashedPassword: user.password };
    }
}

export default UserBaseRespository;
