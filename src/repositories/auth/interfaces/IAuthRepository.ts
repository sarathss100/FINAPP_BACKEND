import IUserDocument from '../../../model/user/interfaces/IUser';

export default interface IAuthRepository {
    createUser(data: Partial<IUserDocument>): Promise<IUserDocument>;
    findByPhoneNumber(phoneNumber: string): Promise<IUserDocument>;
    resetPassword(data: Partial<IUserDocument>): Promise<boolean>;
    restoreUserAccount(userId: string): Promise<void>;
    getUserDetails(userId: string): Promise<IUserDocument>;
    checkUserForSignup(phoneNumber: string): Promise<IUserDocument | null>;
} 