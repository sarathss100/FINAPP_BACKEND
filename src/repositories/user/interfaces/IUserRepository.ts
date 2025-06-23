import IProfile from 'services/user/interfaces/IProfile';

interface IUserRepository {
    findByUserId(userId: string): Promise<IProfile | null>;
    updateUserProfileImageData(userId: string, imageUrl: string, imageId: string): Promise<boolean>;
    getUserProfileImageData(userId: string): Promise<{ imageUrl: string;  imageId: string} | null>;
    toggleTwoFactorAuthentication(userId: string): Promise<boolean>;
    deleteUserAccount(userId: string): Promise<boolean>;
    getImageUrlById(imageId: string): Promise<string | null>;
}

export default IUserRepository;
