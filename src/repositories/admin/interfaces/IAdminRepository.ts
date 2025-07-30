import IPaginationMeta from '../../../dtos/admin/IPaginationMetaDTO';
import ISystemMetricsDTO from '../../../dtos/admin/ISystemMetricsDTO';
import IFaqDocument from '../../../model/admin/interfaces/IFaq';
import IUserDocument from '../../../model/user/interfaces/IUser';

export default interface IAdminRepository {
    findAllUsers(): Promise<IUserDocument[]>;
    toggleUserStatus(userId: string, newStatus: boolean): Promise<boolean>;
    addFaq(newFaq: Partial<IFaqDocument>): Promise<boolean>;
    updateFaq(faqId: string, updatedData: Partial<IFaqDocument>): Promise<boolean>;
    deleteFaq(faqId: string): Promise<boolean>;
    getAllFaqs(): Promise<IFaqDocument[]>;
    getNewRegistrationCount(): Promise<number>;
    getSystemMetrics(): Promise<ISystemMetricsDTO>;
    getAllFaqsForAdmin(page: number, limit: number, search: string): Promise<{ faqDetails: IFaqDocument[], pagination: IPaginationMeta }>;
    togglePublish(faqId: string): Promise<boolean>;
}


