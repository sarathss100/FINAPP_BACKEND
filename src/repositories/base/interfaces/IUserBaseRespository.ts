import IFaq from 'model/admin/interfaces/IFaq';
import IAuthUser from './IAuthUser';

interface IUserBaseRespository {
    findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null>;
    toggleTwoFactorAuthentication(userId: string): Promise<boolean>;
    updateSubscriptionStatus(userId: string): Promise<boolean>;
    getAllFaqs(): Promise<IFaq[] | null>;
}

export default IUserBaseRespository;
