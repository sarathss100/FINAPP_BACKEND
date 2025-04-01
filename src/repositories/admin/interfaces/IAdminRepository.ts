import IUserDetails from './IUserDetails';

interface IAdminRepository {
    findAllUsers(): Promise<IUserDetails[] | null>;
    toggleUserStatus(userId: string, newStatus: boolean): Promise<boolean | null>;
}

export default IAdminRepository;
