import IAuthUser from './IAuthUser';
import { IFaqDTO } from '../../../dtos/base/FaqDto';

interface IUserBaseRespository {
    findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null>;
    toggleTwoFactorAuthentication(userId: string): Promise<boolean>;
    updateSubscriptionStatus(userId: string): Promise<boolean>;
    getAllFaqs(): Promise<IFaqDTO[] | null>;
}

export default IUserBaseRespository;
