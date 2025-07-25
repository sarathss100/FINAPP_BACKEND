import { IFaq } from '../../../dtos/base/FaqDto';
import IUserDetails from './IUserDetails';
import { ISystemMetrics } from './ISystemMetrics';
import IPaginationMeta from '../../../dtos/admin/IPaginationMeta';

interface IAdminRepository {
    findAllUsers(): Promise<IUserDetails[] | null>;
    toggleUserStatus(userId: string, newStatus: boolean): Promise<boolean>;
    addFaq(newFaq: IFaq): Promise<boolean>;
    updateFaq(faqId: string, updatedData: Partial<IFaq>): Promise<boolean>;
    deleteFaq(faqId: string): Promise<boolean>;
    getAllFaqs(): Promise<IFaq[] | null>;
    getNewRegistrationCount(): Promise<number>;
    getSystemMetrics(): Promise<ISystemMetrics>;
    getAllFaqsForAdmin(page: number, limit: number, search: string): Promise<{ faqDetails: IFaq[], pagination: IPaginationMeta }>;
    togglePublish(faqId: string): Promise<boolean>;
}

export default IAdminRepository;
