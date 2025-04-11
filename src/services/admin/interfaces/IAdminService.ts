import IUserDetails from 'repositories/admin/interfaces/IUserDetails';
import IFaq from 'types/admin/IFaq';

interface IAdminService {
    getAllUsers(): Promise<IUserDetails[]>;
    toggleUserStatus(_id: string, status: boolean): Promise<boolean>;
    addFaq(newFaq: IFaq): Promise<boolean>;
}

export default IAdminService;
