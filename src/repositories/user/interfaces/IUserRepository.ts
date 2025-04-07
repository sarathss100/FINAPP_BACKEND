import IProfile from 'services/user/interfaces/IProfile';

interface IUserRepository {
    findByUserId(userId: string): Promise<IProfile | null>;
    updateUserProfileImageUrl(userId: string, imageUrl: string): Promise<boolean>;
    getUserProfileImageUrl(userId: string): Promise<string>;
}

export default IUserRepository;
