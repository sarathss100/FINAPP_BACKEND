import IUserDetails from './IUserDetails';

interface IAdminRepository {
    findAllUsers(): Promise<IUserDetails[] | null>;
}

export default IAdminRepository;
