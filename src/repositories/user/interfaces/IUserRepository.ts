import IUserDocument from "../../../model/user/interfaces/IUser";

export default interface IUserRepository {
    getUserDetails(userId: string): Promise<IUserDocument>;
    toggleTwoFactorAuthentication(userId: string): Promise<boolean>;
    getImageUrlById(imageId: string): Promise<string>;
    updateUserProfileImageData(userId: string, imageUrl: string, imageId: string): Promise<boolean>;
    deleteUserAccount(userId: string): Promise<boolean>;
}