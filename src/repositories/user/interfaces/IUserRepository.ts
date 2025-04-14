import IProfile from 'services/user/interfaces/IProfile';

interface IUserRepository {
    findByUserId(userId: string): Promise<IProfile | null>;
    updateUserProfileImageUrl(userId: string, imageUrl: string): Promise<boolean>;
    getUserProfileImageUrl(userId: string): Promise<string>;
    toggleTwoFactorAuthentication(userId: string, value: boolean): Promise<boolean>;
}

export default IUserRepository;
