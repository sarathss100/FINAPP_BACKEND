import IUserDetails from 'repositories/admin/interfaces/IUserDetails';

interface IAdminService {
    getAllUsers(): Promise<IUserDetails[]>;
    toggleUserStatus(_id: string, status: boolean): Promise<boolean>;
}

export default IAdminService;
