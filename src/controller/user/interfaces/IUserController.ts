import { Request, Response } from 'express';

interface IUserController {
    getUserProfileDetails(request: Request, response: Response): Promise<void>;
    uploadProfilePicture(request: Request, response: Response): Promise<void>;
    getUserProfilePictureUrl(request: Request, response: Response): Promise<void>;
    toggleTwoFactorAuthentication(request: Request, response: Response): Promise<void>;
    deleteUserAccount(request: Request, response: Response): Promise<void>;
    serveProfileImage(request: Request, response: Response): Promise<void>;
}

export default IUserController;
