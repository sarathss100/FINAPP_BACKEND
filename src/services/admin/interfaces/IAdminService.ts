import { IFaq } from 'dtos/base/FaqDto';
import IUserDetails from 'repositories/admin/interfaces/IUserDetails';
import { IHealthStatus } from '../health/interfaces/IHealth';
import { ISystemMetrics } from 'repositories/admin/interfaces/ISystemMetrics';

interface IAdminService {
    getAllUsers(): Promise<IUserDetails[]>;
    toggleUserStatus(_id: string, status: boolean): Promise<boolean>;
    addFaq(newFaq: IFaq): Promise<boolean>;
    updateFaq(faqId: string, updatedData: Partial<IFaq>): Promise<boolean>;
    getAllFaqs(): Promise<IFaq[] | null>;
    getNewRegistrationCount(): Promise<number>;
    getHealthStatus(): Promise<IHealthStatus>;
    getSystemMetrics(): Promise<ISystemMetrics>;
    getAllFaqsForAdmin(): Promise<IFaq[]>;
    deleteFaq(faqId: string): Promise<boolean>;
    togglePublish(faqId: string): Promise<boolean>;
}

export default IAdminService;
