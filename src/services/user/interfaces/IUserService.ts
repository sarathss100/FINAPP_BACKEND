import IProfileDTO from '../../../dtos/user/IProfileDTO';

interface IUserService {
    getUserProfileDetails(accessToken: string): Promise<IProfileDTO>;
    updateUserProfilePicture(file: Express.Multer.File, accessToken: string): Promise<string>;
    getUserProfilePictureUrl(accessToken: string): Promise<string>;
    toggleTwoFactorAuthentication(accessToken: string): Promise<boolean>;
    deleteUserAccount(accessToken: string): Promise<boolean>;
    getImageForProxy(imageId: string): Promise<Buffer | string>;
}

export default IUserService;
