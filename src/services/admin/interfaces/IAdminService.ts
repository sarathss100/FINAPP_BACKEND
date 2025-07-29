import { IHealthStatus } from '../health/interfaces/IHealth';
import IPaginationMeta from '../../../dtos/admin/IPaginationMetaDTO';
import { IFaqDTO } from '../../../dtos/base/IFaqDTO';
import ISystemMetricsDTO from '../../../dtos/admin/ISystemMetricsDTO';
import IUserDTO from '../../../dtos/base/IUserDTO';

export default interface IAdminService {
    getAllUsers(): Promise<IUserDTO[]>;
    toggleUserStatus(_id: string, status: boolean): Promise<boolean>;
    getSystemMetrics(): Promise<ISystemMetricsDTO>;
    addFaq(newFaq: IFaqDTO): Promise<boolean>;
    updateFaq(faqId: string, updatedData: Partial<IFaqDTO>): Promise<boolean>;
    getAllFaqs(): Promise<IFaqDTO[] | null>;
    getNewRegistrationCount(): Promise<number>;
    getHealthStatus(): Promise<IHealthStatus>;
    getAllFaqsForAdmin(page: number, limit: number, search: string): Promise<{ faqDetails: IFaqDTO[], pagination: IPaginationMeta }>;
    deleteFaq(faqId: string): Promise<boolean>;
    togglePublish(faqId: string): Promise<boolean>;
}

