import IProfile from 'services/user/interfaces/IProfile';

interface IUserRepository {
    findByUserId(userId: string): Promise<IProfile | null>;
    updateUserProfileImageUrl(userId: string, imageUrl: string): Promise<boolean>;
    getUserProfileImageUrl(userId: string): Promise<string>;
    toggleTwoFactorAuthentication(userId: string): Promise<boolean>;
    deleteUserAccount(userId: string): Promise<boolean>;
}

export default IUserRepository;
