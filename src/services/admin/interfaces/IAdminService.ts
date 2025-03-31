import IUserDetails from 'repositories/admin/interfaces/IUserDetails';

interface IAdminService {
    getAllUsers(): Promise<IUserDetails[]>
}

export default IAdminService;
