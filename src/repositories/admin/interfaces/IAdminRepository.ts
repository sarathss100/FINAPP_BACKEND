import { IFaq } from 'dtos/base/FaqDto';
import IUserDetails from './IUserDetails';
import { ISystemMetrics } from './ISystemMetrics';

interface IAdminRepository {
    findAllUsers(): Promise<IUserDetails[] | null>;
    toggleUserStatus(userId: string, newStatus: boolean): Promise<boolean>;
    addFaq(newFaq: IFaq): Promise<boolean>;
    updateFaq(faqId: string, updatedData: Partial<IFaq>): Promise<boolean>;
    deleteFaq(faqId: string): Promise<boolean>;
    getAllFaqs(): Promise<IFaq[] | null>;
    getNewRegistrationCount(): Promise<number>;
    getSystemMetrics(): Promise<ISystemMetrics>;
    getAllFaqsForAdmin(): Promise<IFaq[]>;
    togglePublish(faqId: string): Promise<boolean>;
}

export default IAdminRepository;
