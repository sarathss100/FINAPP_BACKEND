import IProfile from 'services/user/interfaces/IProfile';

interface IUserRepository {
    findByUserId(userId: string): Promise<IProfile | null>;
}

export default IUserRepository;
