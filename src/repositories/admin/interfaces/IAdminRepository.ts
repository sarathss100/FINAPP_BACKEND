import IUserDetails from './IUserDetails';
import { ISystemMetrics } from './ISystemMetrics';
import IPaginationMeta from '../../../dtos/admin/IPaginationMeta';
import { IFaqDTO } from '../../../dtos/base/FaqDto';

interface IAdminRepository {
    findAllUsers(): Promise<IUserDetails[] | null>;
    toggleUserStatus(userId: string, newStatus: boolean): Promise<boolean>;
    addFaq(newFaq: IFaqDTO): Promise<boolean>;
    updateFaq(faqId: string, updatedData: Partial<IFaqDTO>): Promise<boolean>;
    deleteFaq(faqId: string): Promise<boolean>;
    getAllFaqs(): Promise<IFaqDTO[] | null>;
    getNewRegistrationCount(): Promise<number>;
    getSystemMetrics(): Promise<ISystemMetrics>;
    getAllFaqsForAdmin(page: number, limit: number, search: string): Promise<{ faqDetails: IFaqDTO[], pagination: IPaginationMeta }>;
    togglePublish(faqId: string): Promise<boolean>;
}

export default IAdminRepository;
