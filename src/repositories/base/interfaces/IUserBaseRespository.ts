import IUserDocument from '../../../model/user/interfaces/IUser';

interface IUserBaseRespository {
    getUserDetails(userId: string): Promise<IUserDocument>;
    toggleTwoFactorAuthentication(userId: string): Promise<boolean>;
    updateSubscriptionStatus(userId: string): Promise<boolean>;
}

export default IUserBaseRespository;
