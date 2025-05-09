import { IFaq } from 'dtos/base/FaqDto';
import IUserDetails from './IUserDetails';

interface IAdminRepository {
    findAllUsers(): Promise<IUserDetails[] | null>;
    toggleUserStatus(userId: string, newStatus: boolean): Promise<boolean>;
    addFaq(newFaq: IFaq): Promise<boolean>;
    updateFaq(faqId: string, updatedData: Partial<IFaq>): Promise<boolean>;
    deleteFaq(faqId: string): Promise<boolean>;
    getAllFaqs(): Promise<IFaq[] | null>;
    getNewRegistrationCount(): Promise<number>;
}

export default IAdminRepository;
