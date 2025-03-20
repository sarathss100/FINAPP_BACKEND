import { SignupDto } from 'dtos/auth/SignupDto';
import IUser from 'model/user/interfaces/IUser';

interface IUserModel {
    create(data: SignupDto): Promise<IUser>
}

export default IUserModel;
