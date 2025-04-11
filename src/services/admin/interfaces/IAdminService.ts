import { IFaq } from 'dtos/base/FaqDto';
import IUserDetails from 'repositories/admin/interfaces/IUserDetails';

interface IAdminService {
    getAllUsers(): Promise<IUserDetails[]>;
    toggleUserStatus(_id: string, status: boolean): Promise<boolean>;
    addFaq(newFaq: IFaq): Promise<boolean>;
    getAllFaqs(): Promise<IFaq[] | null>;
}

export default IAdminService;
