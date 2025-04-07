import IProfile from './IProfile';

interface IUserService {
    getUserProfileDetails(accessToken: string): Promise<IProfile>;
    updateUserProfilePicture(file: Express.Multer.File, accessToken: string): Promise<string>;
    getUserProfilePictureUrl(accessToken: string): Promise<string>;
}

export default IUserService;
